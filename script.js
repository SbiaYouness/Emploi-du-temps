document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    let currentWeek = 4;
    let startX;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    container.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX > endX + 50) {
            loadNextWeekTimetable();
        } else if (startX < endX - 50) {
            loadPreviousWeekTimetable();
        }
    });

    leftButton.addEventListener('click', loadPreviousWeekTimetable);
    rightButton.addEventListener('click', loadNextWeekTimetable);

    function loadNextWeekTimetable() {
        if (currentWeek < 5) {
            currentWeek++;
            updateTimetable();
        }
    }

    function loadPreviousWeekTimetable() {
        if (currentWeek > 4) {
            currentWeek--;
            updateTimetable();
        }
    }

    function updateTimetable() {
        document.querySelector('.week-info .tilted-sticker').textContent = currentWeek;
        fillTimetable(currentWeek === 4 ? initialData : nextWeekData);
        updateArrows();
    }

    function updateArrows() {
        if (currentWeek === 4) {
            leftButton.style.opacity = '0.3';
            leftButton.classList.add('disabled');
        } else {
            leftButton.style.opacity = '1';
            leftButton.classList.remove('disabled');
        }
    
        if (currentWeek === 5) {
            rightButton.style.opacity = '0.3';
            rightButton.classList.add('disabled');
        } else {
            rightButton.style.opacity = '1';
            rightButton.classList.remove('disabled');
        }
    }

    function fillTimetable(data) {
        const timetableBody = document.querySelector('#timetable tbody');
        timetableBody.innerHTML = '';

        data.forEach((day) => {
            const row = document.createElement('tr');
            const dayCell = document.createElement('td');
            dayCell.textContent = day.day;
            dayCell.className = 'time-slot';
            row.appendChild(dayCell);

            day.slots.forEach((slot) => {
                const slotCell = document.createElement('td');
                if (slot.course) {
                    slotCell.className = slot.className;
                    const courseElement = document.createElement('div');
                    courseElement.className = 'course';
                    courseElement.textContent = slot.course;
                    const instructorElement = document.createElement('div');
                    instructorElement.className = 'instructor';
                    instructorElement.textContent = slot.instructor;

                    if (slot.earlyStart) {
                        slotCell.classList.add('early-start');
                        slotCell.setAttribute('data-time', '8:00');
                    }
                    if (slot.earlyFinish) {
                        slotCell.classList.add('early-finish');
                        slotCell.setAttribute('data-time', '12:00');
                    }

                    slotCell.appendChild(courseElement);
                    slotCell.appendChild(instructorElement);

                    // Handle merged cells
                    if (slot.colspan) {
                        slotCell.setAttribute('colspan', slot.colspan);
                    }

                    // Handle last session indicator
                    if (slot.className.includes('last-session')) {
                        const lastLabel = document.createElement('span');
                        lastLabel.className = 'last-label';
                        lastLabel.textContent = 'last';
                        slotCell.appendChild(lastLabel);
                    }
                } else {
                    slotCell.className = 'color-empty';
                }
                row.appendChild(slotCell);
            });

            timetableBody.appendChild(row);

        });
    }

    fillTimetable(initialData);
    updateArrows();
});

// Define timetable data
const initialData = [
    {
        day: "Lundi",
        slots: [
            { course: "AGL C# (+2)", instructor: "Hachmoud (4H)", className: "color-1", earlyStart: true },
            { course: "AGL C# (+2)", instructor: "Hachmoud (4H)", className: "color-1", earlyFinish: true },
            { course: "Gestion projets (+2)", instructor: "Gmira (4H)", className: "color-2" },
            { course: "Gestion projets (+2)", instructor: "Gmira (4H)", className: "color-2" }
        ]
    },
    {
        day: "Mardi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty" },
            { course: "OSI & TCP/IP (+2)", instructor: "Khartoch (4H)", className: "color-3" },
            { course: " ", instructor: " ", className: "color-empty" },
            { course: " ", instructor: " ", className: "color-empty" }
        ]
    },
    {
        day: "Mercredi",
        slots: [
            { course: "OSI & TCP/IP", instructor: "Khartoch", className: "color-3 recently-added" },
            { course: "OSI & TCP/IP (+2)", instructor: "Khartoch (4H)", className: "color-3" },
            { course: "Program. Java (+2)", instructor: "Benslimane (4H) D12", className: "color-4" },
            { course: "Program. Java (+2)", instructor: "Benslimane (4H) D12", className: "color-4" }
        ]
    },
    {
        day: "Jeudi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty" },
            { course: "OSI & TCP/IP (+4)", instructor: "Khartoch (8H)", className: "color-3" },
            { course: "Technologie Web (+2)", instructor: "Tmimi (4H)", className: "color-5" },
            { course: " ", instructor: " ", className: "color-empty" }
        ]
    },
    {
        day: "Vendredi",
        slots: [
            { course: "Conception OO (+2)", instructor: "Hachmoud (4h)", className: "color-1", earlyStart: true },
            { course: "Conception OO (+2)", instructor: "Hachmoud (4H)", className: "color-1", earlyFinish: true },
            { course: " ", instructor: " ", className: "color-empty" },
            { course: " ", instructor: " ", className: "color-empty" }
        ]
    }
];

const nextWeekData = [
    {
        day: "Lundi",
        slots: [
            { course: "AGL C# (+1)", instructor: "Hachmoud (2H)", className: "color-1 last-session", earlyStart: true },
            { course: "AGL C# (+1)", instructor: "Hachmoud (2H)", className: "color-1 last-session", earlyFinish: true },
            { course: "Gestion projets (+1)", instructor: "Gmira (2H)", className: "color-2 last-session" },
            { course: "Gestion projets (+1)", instructor: "Gmira (2H)", className: "color-2 last-session" }
        ]
    },
    {
        day: "Mardi",
        slots: [
            { course: "Droit Social (+5)", instructor: "(10H)", className: "color-uncertain" },
            { course: "OSI & TCP/IP (+1)", instructor: "Khartoch (2H)", className: "color-3 last-session" },
            { course: " ", instructor: " ", className: "color-empty" },
            { course: " ", instructor: " ", className: "color-empty" }
        ]
    },
    {
        day: "Mercredi",
        slots: [
            { course: "OSI & TCP/IP (+1)", instructor: "Khartoch (2H)", className: "color-3 last-session" },
            { course: "OSI & TCP/IP (+1)", instructor: "Khartoch (2H)", className: "color-3 last-session" },
            { course: "Program. Java (+1)", instructor: "Benslimane (2H) D12", className: "color-4 last-session" },
            { course: "Program. Java (+1)", instructor: "Benslimane (2H) D12", className: "color-4 last-session" }
        ]
    },
    {
        day: "Jeudi",
        slots: [
            { course: "Droit Social (+5)", instructor: "(10H)", className: "color-uncertain" },
            { course: "OSI & TCP/IP (+3)", instructor: "Khartoch (6H)", className: "color-3" },
            { course: "Technologie Web (+1)", instructor: "Tmimi (2H)", className: "color-5 last-session" },
            { course: "Technologie Web (+1)", instructor: "Tmimi (2H)", className: "color-5 last-session" }
        ]
    },
    {
        day: "Vendredi",
        slots: [
            { course: "Conception OO (+1)", instructor: "Hachmoud (2H)", className: "color-1 last-session", earlyStart: true },
            { course: "Conception OO (+1)", instructor: "Hachmoud (2H)", className: "color-1 last-session", earlyFinish: true },
            { course: "PFE", instructor: "", className: "color-empty merged", colspan: 2 }
        ]
    }
];