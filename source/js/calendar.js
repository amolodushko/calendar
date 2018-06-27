const DAYS = {
        SUNDAY: 'SUNDAY',
        MONDAY: 'MONDAY',
        TUESDAY: 'TUESDAY',
        WEDNESDAY: 'WEDNESDAY',
        THURSDAY: 'THURSDAY',
        FRIDAY: 'FRIDAY',
        SATURDAY: 'SATURDAY'
    },
    FIRST_DAY_OF_THE_WEEK = 1,
    CALENDAR_SIZE = 42,
    WEEK_MAP = {
        0: {
            value: DAYS.SUNDAY,
            TITLE: 'SU'
        },
        1: {
            value: DAYS.MONDAY,
            TITLE: 'MO'
        },
        2: {
            value: DAYS.TUESDAY,
            TITLE: 'TU'
        },
        3: {
            value: DAYS.WEDNESDAY,
            TITLE: 'WE'
        },
        4: {
            value: DAYS.THURSDAY,
            TITLE: 'TH'
        },
        5: {
            value: DAYS.FRIDAY,
            TITLE: 'FR'
        },
        6: {
            value: DAYS.SATURDAY,
            TITLE: 'SA'
        }
    },
    CALENDAR_CLS = 'calendar';

class Calendar {
    constructor(params) {
        let initialParams = params || {};
        this.firstDayOfTheWeek = initialParams.hasOwnProperty('firstDayOfTheWeek')
            ? initialParams.firstDayOfTheWeek
            : FIRST_DAY_OF_THE_WEEK;

        this.targetId = initialParams.targetId || '';
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);

        this.currentDate = new Date();
    }

    initCalendar(newDate) {
        let date = newDate || new Date(),
            month = date.getMonth(),
            year = date.getFullYear(),
            monthFirstDay = new Date(year, month, 1),
            monthLastDay = new Date(year, month + 1, 0),
            lastDayDate = monthLastDay.getDate(),
            monthMap = {
                0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}
            };

        this.populateDays(monthFirstDay, monthMap, month);
        this.populateDays(monthLastDay, monthMap, month);

        for (let i = 2; i < lastDayDate; i++) {
            this.populateDays(new Date(year, month, i), monthMap, month);
        }

        this.populatePrevNextMonthsDays(year, month, monthFirstDay, lastDayDate, monthMap);

        return monthMap;
    }

    populatePrevNextMonthsDays(year, month, monthFirstDay, lastDayDate, result) {
        let prevMonthLastDayDate = new Date(year, month, 0).getDate(),
            prevMonth = month - 1,
            nextMonth = month + 1,
            prevMonthDaysCount = monthFirstDay.getDay() - this.firstDayOfTheWeek;

        if (prevMonthDaysCount <= 0) {
            prevMonthDaysCount += 7;
        }

        for (let i = prevMonthLastDayDate; i > prevMonthLastDayDate - prevMonthDaysCount; i--) {
            this.populateDays(new Date(year, prevMonth, i), result, month);
        }
        let nextMonthDaysCount = CALENDAR_SIZE - (prevMonthDaysCount + lastDayDate);

        for (let i = 1; i <= nextMonthDaysCount; i++) {
            this.populateDays(new Date(year, nextMonth, i), result, month);
        }
    }

    populateDays(day, monthMap, currentMonth) {
        let weekIndex = day.getDay(),
            month = day.getMonth();

        monthMap[weekIndex][day.getDate()] = {
            day: day,
            today: day - this.today === 0,
            month: month,
            targetMonth: currentMonth === month
        };
    }

    runPrevMonth() {
        const date = this.currentDate;
        this.currentDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        this.drawCalendar();
    }

    runNextMonth() {
        const date = this.currentDate;

        this.currentDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        this.drawCalendar();
    }

    drawCalendar(targetId) {
        let monthMap = this.initCalendar(this.currentDate),
            html = Object.keys(monthMap)
                .sort((a, b) => Number(a) < this.firstDayOfTheWeek ? 1 : a - b)
                .map(key => this.drawColumn(monthMap, key))
                .join(' ');

        const target = document.getElementById(targetId || this.targetId);

        target.classList.add(CALENDAR_CLS);
        target.innerHTML = html;
    }

    drawColumn(monthMap, key) {
        return `<div class="column"> ${this.drawItem(WEEK_MAP[key].TITLE, 'cell title')} ${this.drawCell(monthMap[key])} </div>`;
    }

    drawCell(map) {
        return Object.keys(map)
            .sort((a, b) => map[a].month - map[b].month)
            .map(key => {
                let cls = ['cell', 'day'];

                if (!map[key].targetMonth) {
                    cls.push('other-month');
                }

                if (map[key].today) {
                    cls.push('today');
                }
                return this.drawItem(key, cls.join(' '));
            })
            .join(' ');
    }

    drawItem(item, cls) {
        return `<div class="${cls}"> ${item} </div>`;
    }
}
