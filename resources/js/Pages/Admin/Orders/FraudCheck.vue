<template>
  <AdminLayout>
    <div class="page-content">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title mb-4">Fraud Check Results for {{ phone_number }}</h5>

                <div class="row mb-4">
                  <div class="col-md-12">
                    <div class="card bg-light-success">
                      <div class="card-body text-center py-4">
                        <h5 class="mb-3 success-label">
                          Overall Success Rate: {{ totalCourier.success_rate }}%
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Courier</th>
                        <th class="text-center">Total</th>
                        <th class="text-center">Delivered</th>
                        <th class="text-center">Returned</th>
                        <th class="text-center">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="[courier, info] in courierEntries" :key="courier">
                        <td>
                          <img :src="`/assets/image/logo/${courier}.png`" :alt="capitalize(courier)" class="courier-logo">
                        </td>
                        <td class="text-center">{{ info.total_parcels ?? info.total ?? 0 }}</td>
                        <td class="text-center">{{ info.delivered_parcels ?? info.delivered ?? 0 }}</td>
                        <td class="text-center">{{ info.returned ?? 0 }}</td>
                        <td class="text-center fw-bold">{{ info.success_ratio }}%</td>
                      </tr>
                      <tr class="total-row">
                        <td>Total</td>
                        <td class="text-center">{{ totalCourier.total_parcels ?? 0 }}</td>
                        <td class="text-center">{{ totalCourier.delivered_parcels ?? 0 }}</td>
                        <td class="text-center">{{ totalCourier.returned_parcels ?? 0 }}</td>
                        <td class="text-center fw-bold">{{ totalCourier.success_rate }}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div id="messageContainer" class="mt-4 px-4 text-center">
                  <p class="leading-relaxed max-w-2xl mx-auto mb-2" style="font-weight: bold">
                    <span v-if="(totalCourier.success_rate ?? 0) >= 60" class="text-green-600 font-semibold text-lg">
                      ভালো কাস্টমার, কাশ অন ডেলিভারিতে পার্সেল পাঠানো যাবে।
                    </span>
                    <span v-else class="text-danger font-semibold text-lg">
                      সফল ডেলিভারি রেট ৬০% এর নিচে, পার্সেল পাঠানোর আগে আরও উন্নতি প্রয়োজন।
                    </span>
                    <br>
                  </p>
                  <span class="text-sm text-gray-600 mt-4 block" style="font-weight: bold">
                    সফল ডেলিভারি রেট অনুযায়ী পরবর্তী পদক্ষেপ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  data: { type: Object, required: true },
  phone_number: { type: String, required: true },
})

const totalCourier = computed(() => props.data.courierData?.total_courier ?? {})

const courierEntries = computed(() =>
  Object.entries(props.data.courierData ?? {}).filter(([courier]) => courier !== 'total_courier')
)

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.text-green-600 {
  color: rgb(22 163 74);
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.max-w-2xl {
  max-width: 42rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.bg-light-success {
  background-color: rgba(40, 167, 69, 0.1) !important;
  border-left: 4px solid #28a745;
}

.courier-logo {
  height: 40px;
  margin-right: 10px;
  object-fit: contain;
}

.success-label {
  color: #28a745;
  font-weight: 600;
}

.total-row {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>
