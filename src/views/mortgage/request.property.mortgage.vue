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
    askingPrice: '',
}

const property = ref<Property>();
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');

const mortgageRequest = ref({
    income: '',
    extraMortgageAmount: '',
    ownMoney: '',
    interestRate: 1.0381,
    // monthlyMortgageAmount: 0, // start with 35% of income
});
const monthlyMortgageAmount = ref(0);

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
        .then(async (result: any) => {
            property.value = result;
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

function calculateTotalMortgage() {
    let totalYearsMortgagePaid = 0;
    let mortgageYear = 0;
    let totalInterestPaidOff = 0;

    // total amount paid off after mortgage
    let totalAmount = 0;

    const ETHPrice = 1870;
    const income = Number(mortgageRequest.value.income);
    const extraMortgageAmount = Number(mortgageRequest.value.extraMortgageAmount);
    const ownMoney = Number(mortgageRequest.value.ownMoney);

    // when first set value is 35% of income
    const monthlyMortgagePrice = monthlyMortgageAmount.value;

    if (property.value && income > 1850) {
        const askingPriceInDollars = Number(property.value.askingPrice.toString()) * ETHPrice;
        const extraMortgageAmountInDollars = Number(extraMortgageAmount) * ETHPrice;
        const ownMoneyInDollars = Number(ownMoney) * ETHPrice;

        // totalMortgage in Dollars
        let totalMortgagePrice = (askingPriceInDollars + extraMortgageAmountInDollars) - ownMoneyInDollars;
        totalMortgage.value = totalMortgagePrice;
        console.log(totalMortgagePrice); // 187000

        // total months mortgage duration before mortgage is paid off
        const monthlyMortgageDuration = totalMortgagePrice / monthlyMortgagePrice;

        // total years for mortgage
        const yearlyMortgageDuration = Number(monthlyMortgageDuration / 12).toFixed() // 14.8 = 15
        let monthlyDecreaseMonth = [];
        for (let i = 1; i <= Number(yearlyMortgageDuration); i++) {
            const result = i * 12 - 1; // -1 used in next for loop
            monthlyDecreaseMonth.push(result);
        }
        // result: [11, 23, 35, 47, 59, 71, 83, 95, 107, 119, 131, 143, 155, 167]

        // console.log(monthlyMortgageDuration);
        //
        // console.log(monthlyDecreaseMonth); // array of months when on year mortgage is paid off
        // so interest rest is calculated over this rest value and incremented with interest.

        // payoff each year: ex: 12.600 = 1.050pm
        const mortgagePayOfEachYear = monthlyMortgagePrice * 12;
        console.log(mortgagePayOfEachYear); // 12600
        // first year mortgage calculation
        let mortgagePriceLeft = totalMortgagePrice * mortgageRequest.value.interestRate;
        for(let i = 0; i <= monthlyMortgageDuration; i++) {
            for(let j = 0; j <= monthlyDecreaseMonth.length; j++) {
                // is called 15 times
                if (monthlyDecreaseMonth[j] === i) {
                    // year is paid of, decrement with yearly payoff value
                    // increment with interest rate
                    // year has ended, deduct mortgagePayOfEachYear and calculate
                    // new total price with incremented interest rate
                    console.log(`we've entered month ${monthlyDecreaseMonth[j]}`);
                    let currentMortgagePrice = mortgagePriceLeft;
                    console.log(`current mortgage to pay off: ${currentMortgagePrice}`);

                    console.log(`In this year ${currentMortgagePrice} is reduced with ${mortgagePayOfEachYear}`);
                    console.log(`${mortgageYear + 1} year is paid off`);

                    let yearlyMortgageDeduction = currentMortgagePrice - mortgagePayOfEachYear;

                    console.log(`After first year, this is what is left of mortgage: ${yearlyMortgageDeduction}`);

                    let newMortgagePrice = yearlyMortgageDeduction * mortgageRequest.value.interestRate;
                    console.log(`We increment this new mortgage with interest rate`);
                    console.log(`${newMortgagePrice}`);
                    console.log(`new mortgage price after ${i} months ${newMortgagePrice}`);


                    totalInterestPaidOff += (newMortgagePrice - yearlyMortgageDeduction);
                    mortgagePriceLeft = newMortgagePrice;

                    totalYearsMortgagePaid++;
                    mortgageYear++;
                    console.log(mortgageYear, totalYearsMortgagePaid);
                    // mortgagePriceLeft = yearlyMortgageDeduction * mortgageRequest.value.interestRate;
                }
            }

            // mortgagePriceLeft -= monthlyMortgagePrice;
            totalAmount += monthlyMortgagePrice;
        }
        // after 14 years there is 57500 still to be paid off
        console.log(mortgagePriceLeft);
        // interest paid off 42.214 in 15 years = 234.50pm interest for ETH liq providers
        console.log(`in ${totalYearsMortgagePaid} years total profits are ${totalInterestPaidOff}`);

        // // we have a rest value for the mortgage and we're not calculating any interest anymore.
        // const restYearsToPay = (mortgagePriceLeft / monthlyMortgagePrice) / 12;
        //
        // const restMonthsToPay = (restYearsToPay * 12) * totalAmount
        // mortgageYear += restYearsToPay;
        // // still rest value of 57500... = 4.5 years extra pay off
        //
        // totalAmount += restMonthsToPay
    }

    const endAmountPaid = totalAmount + totalInterestPaidOff;
    console.log(`TOTAL MORTGAGE PAY OFF IS ${endAmountPaid}`);

    totalInterestPaidOff = endAmountPaid - totalMortgage.value;
    totalAmountPaidOff.value = endAmountPaid;
    totalInterestPaid.value = totalInterestPaidOff;
    totalMortgageYears.value = mortgageYear;
    //console.log(`TOTAL MORTGAGE PAY OFF IS ${totalAmount}`); // value is totally wrong xD
    // console.log(`mortgage will be paid off in ${mortgageYear} years`);
}

watch(mortgageRequest, () => {
    if(mortgageRequest.value.income !== '') {
        monthlyMortgageAmount.value = Number(mortgageRequest.value.income) * 0.35; // 35% of income
        monthlyMortgageAmountSet.value = monthlyMortgageAmount.value;
        calculateTotalMortgage();
    }
}, {deep: true});

watch(monthlyMortgageAmount, () => {
    if (monthlyMortgageAmount.value > (Number(mortgageRequest.value.income) * 0.35)) {
        monthlyMortgageAmount.value = Number(mortgageRequest.value.income) * 0.35;
    }
    if (monthlyMortgageAmount.value !== monthlyMortgageAmountSet.value && monthlyMortgageAmount.value >= 500) {
        calculateTotalMortgage();
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
                          <input type="number" v-model="monthlyMortgageAmount" :max="mortgageRequest.income * 0.35" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-800 shadow-sm ring-1 ring-inset ring-purple-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" />
                            <div v-if="mortgageRequest.income !== ''" class="bg-blue-100 p-2 mt-2 rounded-lg border border-blue-500 text-blue-500">
                                Max monthly mortgage amount: ${{mortgageRequest.income * 0.35}}
                            </div>
                      </div>
                  </div>
                  <div class="col-span-full">
                      <div class="bg-blue-100 p-2 mt-2 rounded-lg border border-blue-500 text-blue-500">
                        Information about your mortgage:<br>
                          <code>
                              Total Years to pay off: {{totalMortgageYears}} <br>
                              Total Mortgage amount: {{totalMortgage}} <br>
                              Total Interest paid: {{totalInterestPaid}} <br>
                              Total amount paid: {{totalAmountPaidOff}} <br>
                          </code>
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
