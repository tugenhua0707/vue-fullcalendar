<template>
  <div class="tb-full-calendar">
    <tb-calendar-header 
      :current-month="currentMonth"
      :current-year="currentYear"
      :start-year="startYear"
      :end-year="endYear"
      :first-day="firstDay"
      @change="emitChangeMonth"
    >
      <div slot="header-left">
        <slot name="tb-header-left"></slot>
      </div>
      <div slot="header-right">
        <slot name="tb-header-right"></slot>
      </div>
    </tb-calendar-header>
    <div class="tb-full-calendar-body">
      <div class="tb-weeks">
        <strong class="tb-week" v-for="item in 7">{{ (item - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="tb-dates" ref="dates">
        <div class="tb-dates-bg">
          <div class="tb-week-row" v-for="(week, parentIndex) in currentDates">
            <div class="tb-day-cell" 
              v-for="(day, childIndex) in week" 
              :class="{'tb-today': day.isToday, 'tb-not-cur-month': !day.isCurMonth, 'tb-week-end': day.isweekEnd}" @click="dayCell(day, parentIndex, childIndex)">
              <p class="tb-day-number">{{ day.monthDay }}</p>
              <div class="tb-combination" v-if="day.totalCount">总额度: {{day.totalCount}}</div>
              <div class="tb-already-apply" v-if="day.alreadyApply">已申请: {{day.alreadyApply}}</div>
              <div class="tb-can-apply" v-if="day.canApply">可申请: {{day.canApply}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script  type="text/babel">
  import dateFunc from './components/dateFunc';
  import moment from 'moment';
  import Header from './components/header.vue';
  export default {
    props: {
      // 一个星期的第一天，默认为0
      firstDay: {
        type: [Number, String],
        default: 0,
        validator (val) {
          let res = parseInt(val);
          return res >=0 && res <= 6
        }
      },
      locale : {
        type : String,
        default : 'zh-CN'
      },
      startYear: {
        type: [Number, String],
        default: '1970'
      },
      endYear: {
        type: [Number, String],
        default: '2030'
      }
    },
    components: {
      'tb-calendar-header': Header
    },
    data () {
      return {
        // 获取当前年份中的月份的第一天
        currentMonth: moment().startOf('month'),
        // 获取当前的年份
        currentYear: moment().startOf('year'),
        // 保存日历的值
        dateArrs: []
      }
    },
    computed: {
      currentDates () {
        return this.getCalendar();
      }
    },
    created() {

    },
    methods: {
      emitChangeMonth (firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth;
        let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay);
        let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);
        this.$emit('changeMonth', start, end, firstDayOfMonth);
      },
      getCalendar () {
        // 根据firstDay 来获取当前月份的某一天的开始日历
        let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay);
        console.log(monthViewStartDate);
        this.dateArrs = [];
        for(let perWeek = 0 ; perWeek < 6 ; perWeek++) {
          let week = [];
          for(let perDay = 0 ; perDay < 7 ; perDay++) {
            week.push({
              monthDay : monthViewStartDate.date(),  // 获取月份中的多少号
              isToday : monthViewStartDate.isSame(moment(), 'day'),  // 判断月份中的多少号是否是今天
              isCurMonth : monthViewStartDate.isSame(this.currentMonth, 'month'), // 判断当前月份是否是这个月
              weekDay : perDay, // 0~6 循环
              isweekEnd: (monthViewStartDate.day() === 6) || (monthViewStartDate.day() === 0), // 是否是周末
              totalCount: 0,
              alreadyApply: 0,
              canApply: 0,
              date : moment(monthViewStartDate) // 组成Moment对象   
            });
            // 循环一次后，再增加一天，再往后一天循环，依次类推，直到循环结束
            monthViewStartDate.add(1, 'day');
          }
          this.dateArrs.push(week);
        }
        console.log(this.dateArrs)
        return this.dateArrs;
      },
      dayCell(day, parentIndex, childIndex) {
        this.$set(this.currentDates[parentIndex][childIndex], 'totalCount', 100);
        this.$set(this.currentDates[parentIndex][childIndex], 'alreadyApply', 20);
        this.$set(this.currentDates[parentIndex][childIndex], 'canApply', 80);
        console.log(this.currentDates[parentIndex][childIndex]);
      }
    },
    filters: {
      localeWeekDay (weekday, firstDay, locale) {
        firstDay = parseInt(firstDay);
        const localMoment = moment().locale(locale);
        return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
      }
    }
  }
</script>
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .tb-full-calendar {
    padding: 20px; background: #fff; 
  }
  .tb-full-calendar-body {
      margin-top: 20px;
    }
    .tb-full-calendar-body .tb-weeks {
      display: flex;
      border: 1px solid #e0e0e0;
      border-right: none;
      height: 28px;
      line-height: 28px;
    }
    .tb-full-calendar-body .tb-weeks .tb-week {
      flex: 1;
      text-align: center;
      border-right: 1px solid #e0e0e0;
    }
    .tb-full-calendar-body .tb-dates {
      position: relative;
    }
    .tb-full-calendar-body .tb-week-row {
      display: flex;
      border-left: 1px solid #e0e0e0;
    }
    .tb-full-calendar-body .tb-day-cell {
      flex: 1;
      cursor: pointer;
      min-height: 112px;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }
    .tb-full-calendar-body .tb-day-cell .day-number {
      text-align: left;
    }
    .tb-full-calendar-body .tb-not-cur-month .day-number {
      color: rgba(0, 0, 0, 0.24);
    }
    .tb-full-calendar-body .tb-datas-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
    }
    .tb-full-calendar-body .tb-datas-events .tb-events-week {
      display: flex;
    }
    .tb-full-calendar-body .tb-datas-events .tb-events-day {
      flex: 1;
      cursor: pointer;
      min-height: 112px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tb-full-calendar-body .tb-day-number {
      text-align: left;
      padding: 4px 5px 0px 4px;
    }
    .tb-full-calendar-body .tb-not-cur-month .tb-day-number {
      color: rgba(0, 0, 0, 0.24);
    }
    .tb-combination, .tb-already-apply, .tb-can-apply {
      text-align: center;
      font-size: 12px;
      line-height: 22px;
    }
    .tb-combination {
      color: orange;
    }
    .tb-already-apply {
      color: green;
    }
    .tb-can-apply {
      color: red;
    }
</style>
