<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref, watch} from "vue";
import MortgagePool from "@/chain/MortgagePool";
import {ethers} from "ethers";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";

const store = walletConnectionStore();
const route = useRoute();

type Property = {
    addr: Address,
    askingPrice: string,
    id: string,
    seller: string,
    created: string
}
type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

const property = ref<Property>({} as Property);
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');

const mortgageRequest = ref({
    income: '',
    extraMortgageAmount: '0',
    ownMoney: '103',
});
const interestRate = ref(2.5);
const monthlyMortgageAmount = ref(0);
const minMonthlyAmount = ref(0); // when mortgage takes longer than 35 years, this is the minimum monthly amount
const monthlyMortgageAmountSet = ref(0);

const totalAmountPaidOff = ref(0);
const totalMortgage = ref(0);
const totalInterestPaid = ref(0);
const totalMortgageYears = ref(0);

onBeforeMount(async () => {
    if (route.params.address) {
        propertyContractAddress.value = `${route.params.address}`;
        await getProperty(`${route.params.address}`);
        await getBidOpen(`${route.params.address}`);
    }
});

async function getProperty(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: Property) => {
            property.value = result;

            console.log({property: property.value})
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getBidOpen(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.biddingOpenTime()
        .then(async (result: any) => {
            const currentDate = new Date().getTime();
            const contractOpenTime = new Date(result.toString() * 1000).getTime();
            contractOpenDate.value = new Date(result.toString() * 1000);

            bidOpen.value = currentDate >= contractOpenTime;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

function calculateMortgageTotalAmount(income: number, propertyCost: number) {
    totalMortgage.value = propertyCost;
    const monthlyInterestRate = (interestRate.value / 100) / 12; // monthly interest rate
    const loanAmount = propertyCost; // assume full property cost as loan amount

    console.log({totalMortgage, monthlyInterestRate, loanAmount, monthlyMortgageAmount})

    let n = -Math.log(1 - monthlyInterestRate * loanAmount / monthlyMortgageAmount.value) /
      Math.log(1 + monthlyInterestRate); // number of months to pay off loan

    console.log(n);
    if (n > 420) { // limit number of mortgage years to maximum of 35 years
        let copyOfN = n;
        n = 420;
        let monthlyMortgage = loanAmount * monthlyInterestRate /
          (1 - Math.pow(1 + monthlyInterestRate, -n));
        // @ts-ignore
        minMonthlyAmount.value = Number(monthlyMortgage).toFixed(2);

        console.log({minMonthlyAmount, monthlyMortgageAmount})
        if (Number(minMonthlyAmount.value) > Number(monthlyMortgageAmount.value)) {
            // @ts-ignore
            monthlyMortgageAmount.value = Number(monthlyMortgageAmount.value).toFixed(2);
            // @ts-ignore
            minMonthlyAmount.value = Number(monthlyMortgage).toFixed(2);

            n = copyOfN;
        } else {
            // @ts-ignore
            monthlyMortgageAmount.value = Number(monthlyMortgage).toFixed(2);
        }
    } else {
        // calculate what min should be
        let m = 420;
        minMonthlyAmount.value = loanAmount * monthlyInterestRate /
          (1 - Math.pow(1 + monthlyInterestRate, -m));
    }

    totalMortgageYears.value = n/12;
    const totalPaid = monthlyMortgageAmount.value * n; // total amount paid over the loan term
    totalAmountPaidOff.value = Number(totalPaid.toFixed(2));
    totalInterestPaid.value = Number((totalPaid - loanAmount).toFixed(2));
    return totalPaid.toFixed(2); // round to 2 decimal places
}

let providerStakeResults = ref([]);
let totalStake = ref(0);
let totalAmount = ref(0);
async function provideMortgageLiquidity() {
    totalStake.value = 0;
    providerStakeResults.value = [];
    totalAmount.value = 0;

    const profitToShare = 24391; // total ETH staked by all liquidity providers // 128370 (100 properties?)
    const totalETH = 10000; // total amount to be staked
    const numStakers = 1824; // number of stakers
    const maxStake = 10; // maximum stake for the first staker
    const minStake = 1; // minimum stake for the last staker
    const decrement = (maxStake - minStake) / (numStakers - 1); // amount to decrement for each subsequent staker
    let currentStake = maxStake; // current stake amount
    let totalStaked = 0; // total amount staked
    const providerShares = []; // array to hold the share of each provider

    for (let i = 1; i <= numStakers; i++) {
        currentStake = Math.max(currentStake - decrement, minStake); // calculate current stake
        const remainingETH = totalETH - totalStaked; // calculate remaining ETH to be staked
        const stakedETH = Math.min(currentStake, remainingETH); // stake either current stake or remaining ETH
        providerShares.push(stakedETH);
        console.log(`Staker ${i} staked ${stakedETH.toFixed(2)} ETH`);
        totalStaked += stakedETH; // add staked amount to total
        totalStake.value += stakedETH;
    }

    console.log(`Total of ${totalStake}ETH staked by all liquidity providers`);

    for (let i = 0; i < providerShares.length; i++) {
        const share = providerShares[i] / totalStake.value * 100;
        totalAmount.value +=  profitToShare / 100 * share;
        const amount = profitToShare / 100 * share;
        const result = `Liquidity provider ${i} staked ${providerShares[i]}ETH and has a share of ${share}%. Resulting in $${amount.toFixed(4)} profit.`;
        providerStakeResults.value.push(result);
    }

}

function calcMortgage() {
    const ETHPrice = 1870;
    const mortgageNeeded = (Number(property.value.askingPrice.toString()) + Number(mortgageRequest.value.extraMortgageAmount)) - Number(mortgageRequest.value.ownMoney)
    calculateMortgageTotalAmount(Number(mortgageRequest.value.income), Number(mortgageNeeded) * ETHPrice);

    if (minMonthlyAmount.value / 0.35 >= Number(mortgageRequest.value.income)) {
        provideMortgageLiquidity();
    }
}

watch(mortgageRequest, () => {
    if(mortgageRequest.value.income !== '') {
        monthlyMortgageAmount.value = Number(mortgageRequest.value.income) * 0.35; // 35% of income
        monthlyMortgageAmountSet.value = monthlyMortgageAmount.value;
        calcMortgage();
    }
}, {deep: true});

watch(monthlyMortgageAmount, () => {
    if (monthlyMortgageAmount.value > (Number(mortgageRequest.value.income) * 0.35)) {
        monthlyMortgageAmount.value = Number(mortgageRequest.value.income) * 0.35;
    }
    if (monthlyMortgageAmount.value !== monthlyMortgageAmountSet.value && monthlyMortgageAmount.value > 0) {
        monthlyMortgageAmountSet.value = monthlyMortgageAmount.value;
        calcMortgage();
    }
})
</script>
<template>
  <div v-if="store.isConnected" class="mx-auto max-w-7xl pb-12">
      <div class="bg-gray-100 shadow rounded-md p-4">
          <div>
              <h2 class="text-base font-semibold leading-7 text-gray-800">Personal Information</h2>
              <p class="text-xs">
                  Please provide your personal information to be considered for a mortgage.
                  KYC data is stored privately, only needed information is shared with the lender.
                  <br>
                  {{ property.askingPrice.toString() }}ETH
                  <br>
                  ${{ Number(property.askingPrice.toString()) * 1870 }}
              </p>
              <div class="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Property Asking Price</label>
                      <div class="mt-2">
                          <input type="text" disabled :value="`${property.askingPrice.toString()} ETH`" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Extra funds needed (max 15% of asking price)</label>
                      <p class="text-xs">
                          {{(Number(property.askingPrice.toString()) * 0.15)}}ETH
                      </p>
                      <div class="mt-2">
                          <input
                            type="number"
                            :max="(Number(property.askingPrice.toString()) * 0.15)"
                            v-model="mortgageRequest.extraMortgageAmount"
                            class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Own Money, in ETH</label>
                      <div class="mt-2">
                          <input type="text" v-model="mortgageRequest.ownMoney" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Mortgage Needed</label>
                      <div class="mt-2">
                          <input
                            type="text"
                            disabled
                            :value="(Number(property.askingPrice.toString()) + Number(mortgageRequest.extraMortgageAmount)) - Number(mortgageRequest.ownMoney)"
                            class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Income</label>
                      <div class="mt-2">
                          <input type="text" v-model="mortgageRequest.income" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label class="block text-sm font-medium leading-6 text-gray-800">Preferred Monthly Mortgage Amount</label>
                      <div class="mt-2">
                          <input type="number" v-model="monthlyMortgageAmount" :max="(mortgageRequest.income * 0.35)" :min="(mortgageRequest.income * 0.35) / 1.6" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                            <div v-if="mortgageRequest.income !== ''" class="bg-blue-100 p-2 mt-2 rounded-lg border border-blue-500 text-blue-500">
                                Max monthly mortgage amount: ${{mortgageRequest.income * 0.35}}
                                <br>
                                Min monthly mortgage amount:

                                ${{ Number(minMonthlyAmount).toFixed(2) }}
                            </div>
                      </div>
                  </div>
                  <div class="col-span-full">
                      <div class="bg-blue-100 p-2 mt-2 rounded-lg border border-blue-500 text-blue-500">
                        Information about your mortgage:<br>
                          <code>
                              Interest Rate: {{interestRate}}% <br>
                              Total Years to pay off: {{totalMortgageYears}} <br>
                              Total Mortgage amount: {{totalMortgage}} <br>
                              Total Interest paid: {{totalInterestPaid}} <br>
                              Total amount paid: {{totalAmountPaidOff}} <br>
                          </code>
                      </div>
                  </div>
                  <div v-if="providerStakeResults.length > 0" class="mt-4 col-span-full">
                      <div class="bg-yellow-100 p-2 mt-2 rounded-lg border border-yellow-500 text-yellow-500">
                          <h3 class="text-lg font-bold">Provider Stake Results: {{totalStake}}ETH Staked</h3>
                          <span v-for="result in providerStakeResults" class="block w-full pb-2">
                              {{result}}
                          </span>
                          <h3 class="text-lg font-bold">Total Payout: {{totalAmount}}</h3>
                      </div>

                  </div>
              </div>
              <div class="mt-8 block">
                  <button class="border-2 border-yellow-500 text-yellow-500 rounded-md px-2 py-3">Request Mortgage</button>
              </div>
          </div>
      </div>
  </div>
</template>
