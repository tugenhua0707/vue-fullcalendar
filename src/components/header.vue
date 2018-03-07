
<template>
  <div class="tb-full-calendar-header">
    <div class="tb-header-left">
      <slot name="header-left">
      </slot>
    </div>
    <div class="tb-header-center">
      <span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span>
      <div class="tb-date_txt" @click.stop="selectDate" v-if="!isSetDate">
        <span class="y">{{year}}</span>年
        <span class="m">{{month}}</span>月
      </div>
      <div class="tb-date_set" v-if="isSetDate">
        <select id="tb-year" v-model="year" @change.stop="changeYear">
          <option :value="item" v-for="item in startEndDate" checked="false">{{item}}</option>
        </select>
        <select id="tb-month" v-model="month" @change.stop="changeMonth">
          <option :value="item" v-for="item in 12">{{item}}</option>
        </select>
      </div>
      <span class="next-month" @click.stop="goNext">{{rightArrow}}</span>
    </div>
    <div class="tb-header-right">
      <slot name="header-right">
      </slot>
    </div>
  </div>
</template>

<script type="text/javascript">
  import dateFunc from './dateFunc'
  import moment from 'moment';
  export default {
    props: {
      currentMonth: {
        type: [String, Number, Object],
        required: true
      },
      currentYear: {
        type: [String, Number, Object],
        required: true
      },
      startYear: {
        type: [String, Number],
        required: true
      },
      endYear: {
        type: [String, Number],
        required: true
      }
    },
    data () {
      return {
        leftArrow  : '<',
        rightArrow : '>',
        month: '',
        year: '',
        isSetDate: false
      }
    },
    created: function() {
      
    },
    computed: {
      startEndDate() {
        let arrs = [];
        let startDate = this.startYear - 0;
        let endDate = this.endYear - 0;
        for (let i = startDate; i < endDate; i++) {
          arrs.push(i);
        }
        return arrs;
      }
    },
    mounted: function() {
      this.year = moment(this.currentYear).years();
      this.month = moment(this.currentMonth).months() + 1;
    },
    methods: {
      goPrev () {
        var newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month');
        if (newMonth.months() === 11) {
          this.year = this.year - 1;
        }
        this.month = newMonth.months() + 1;
        this.$emit('change', newMonth);
      },
      goNext () {
        var newMonth = moment(this.currentMonth).add(1, 'months').startOf('month');
        this.month = newMonth.months() + 1;
        if (newMonth.months() === 0) {
          this.year = this.year + 1;
        }
        this.$emit('change', newMonth);
      },
      selectDate () {
        this.isSetDate = true;
      },
      changeMonth () {
        var newMonth = moment().set('year', this.year).set('month', this.month - 1);
        this.$emit('change', newMonth);
      },
      changeYear() {
        var newYear = moment().set('year', this.year).set('month', this.month - 1);
        this.$emit('change', newYear, true);
      }
    }
  }
</script>
<style>
  #tb-year, #tb-month {
    width: 60px;
    height: 26px;
  }
  .tb-full-calendar-header {
      display: flex;
      align-items: center;
    }
    .tb-header-left, .tb-header-right {
      flex: 1;
    }
    .tb-header-center {
      text-align: center;
    }
    .tb-header-center .prev-month, .tb-header-center .next-month {
      cursor: pointer;
      float: left;
      margin: 0 20px;
    }
    .tb-date_txt,.tb-date_set {
      float: left;
      cursor: pointer;
    }
    .tb-header-center .title {
      margin: 0 10px;
    }
</style>