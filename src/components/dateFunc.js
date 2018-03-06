import moment from 'moment';

let dateFunc = {
  /*
   获取当前年份中的月份的第一天
   @param {date} 当前年份中的月份的日期
   @param {firstDay} 第一天 默认为0
  */
  getMonthViewStartDate (date, firstDay) {
    firstDay = parseInt(firstDay);
    let start = moment(date);
    let startOfMonth = moment(start.startOf('month'));
    /*
     let start = moment(moment().startOf('month')); 
     let startOfMonth = moment(moment(moment().startOf('month')).startOf('month'));
     // 如上获取当前年份中的当前月份 
    */
    start.subtract(startOfMonth.day(), 'days');
    /*
     moment().subtract(1, 'day'); 的含义是 返回当前的月份的日期的前一天，比如当前日期是 3月5号，那么前一天就是3月4号
     moment(moment(moment().startOf('month')).startOf('month')).day(); 返回当前月份中的第一天是礼拜几

     start.subtract(startOfMonth.day(), 'days'); 
     => 变成如下
     moment(moment().startOf('month')).subtract(moment(moment(moment().startOf('month')).startOf('month')).day(), 'days');
     => 变成如下：
     moment(moment().startOf('month')).subtract(4, 'days'); 含义是：返回当前月份的第一天的前四天
    */
    /*
     if (startOfMonth.day() < firstDay) {
      start.subtract(7, 'days');
     }
     如果当前年份中的月份第一天的礼拜几 小于 firstDay的话，那么面板中显示的单元格从当前月份的第一天 往前推 7天。
     比如2018-3月份 第一天是礼拜四，正常日历面板显示是 25，26，27，28，1，2.... 依次递增
     那么如果 firstDay = 5的话，那么就在当前月份的第一天往前推7天.
    */
    if (startOfMonth.day() < firstDay) {
      start.subtract(7, 'days');
    }
    /*
     start.add(firstDay, 'days') 代码含义是：
     面板中的日历显示延后 firstDay 天。
     比如 2018-3月份是 25，26，27，28，1，2 .... 依次递增。如果firstDay=2的话，那么面板中显示就是
     27, 28, 1, 2, .... 依次递增。直到面板中的单元格都排满了。
     */
    start.add(firstDay, 'days');
    return start;
  },
  // 获取当前开始日期的6个星期后，作为结束日期，因为面板单元格有6行
  getMonthViewEndDate (date) {
    return this.getMonthViewStartDate().add(6, 'weeks');
  }
};

module.exports = dateFunc;
