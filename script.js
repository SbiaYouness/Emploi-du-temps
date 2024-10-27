document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    const groupButtons = document.querySelectorAll('.buttons1 button');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    const swipeIndicatorContainer = document.querySelector('.swipe-indicator-container');
    let currentGroup = 1;
    let startX;
    let isDragging = false;
    let isSwipeInsideTimetable = false;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            isSwipeInsideTimetable = true;
        }
    });

    container.addEventListener('touchend', (e) => {
        if (isSwipeInsideTimetable) {
            isSwipeInsideTimetable = false;
            return;
        }
    });

    document.body.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            isSwipeInsideTimetable = false;
        }
    });

    document.body.addEventListener('touchend', (e) => {
        if (!isSwipeInsideTimetable && e.changedTouches.length === 1 && e.touches.length === 0) {
            const endX = e.changedTouches[0].clientX;
            if (startX > endX + 50) {
                loadNextGroupTimetable();
            } else if (startX < endX - 50) {
                loadPreviousGroupTimetable();
            }
        }
    });

    swipeIndicator.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
        }
    });

    swipeIndicator.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            const moveX = e.touches[0].clientX - startX;
            const containerWidth = swipeIndicatorContainer.offsetWidth;
            const indicatorWidth = swipeIndicator.offsetWidth;
            let newLeft = swipeIndicator.offsetLeft + moveX;

            // Constrain the indicator within the container
            newLeft = Math.max(0, Math.min(newLeft, containerWidth - indicatorWidth));
            swipeIndicator.style.left = `${newLeft}px`;

            startX = e.touches[0].clientX;
        }
    });

    swipeIndicator.addEventListener('touchend', (e) => {
        if (isDragging) {
            isDragging = false;
            const containerWidth = swipeIndicatorContainer.offsetWidth;
            const indicatorWidth = swipeIndicator.offsetWidth;
            const thirdWidth = containerWidth / 3;

            // Determine the new position of the indicator
            if (swipeIndicator.offsetLeft < thirdWidth / 2) {
                swipeIndicator.style.left = '0';
                currentGroup = 1;
            } else if (swipeIndicator.offsetLeft < 1.5 * thirdWidth) {
                swipeIndicator.style.left = `${thirdWidth}px`;
                currentGroup = 2;
            } else {
                swipeIndicator.style.left = `${2 * thirdWidth}px`;
                currentGroup = 3;
            }

            updateTimetable();
        }
    });

    leftButton.addEventListener('click', loadPreviousGroupTimetable);
    rightButton.addEventListener('click', loadNextGroupTimetable);

    groupButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentGroup = parseInt(button.id.replace('G', ''));
            document.querySelector('.container1').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
            updateSwipeIndicator();
            updateArrowButtonsVisibility();
            updateTimetable();
        });
    });

    function loadNextGroupTimetable() {
        if (currentGroup < 3) {
            currentGroup++;
            updateSwipeIndicator();
            updateTimetable();
        }
    }

    function loadPreviousGroupTimetable() {
        if (currentGroup > 1) {
            currentGroup--;
            updateSwipeIndicator();
            updateTimetable();
        }
    }

    function updateSwipeIndicator() {
        const containerWidth = swipeIndicatorContainer.offsetWidth;
        const thirdWidth = containerWidth / 3;

        if (currentGroup === 1) {
            swipeIndicator.style.left = '0';
        } else if (currentGroup === 2) {
            swipeIndicator.style.left = `${thirdWidth}px`;
        } else if (currentGroup === 3) {
            swipeIndicator.style.left = `${2 * thirdWidth}px`;
        }
    }

    function updateTimetable() {
        document.querySelector('.tilted-sticker').textContent = `G${currentGroup}`;
        fillTimetable(currentGroup === 1 ? group1Data : currentGroup === 2 ? group2Data : group3Data);
        updateArrows();
        updateBackgroundColor();
        highlightCurrentDay();
    }

    function updateBackgroundColor() {
        document.body.className = ''; // Clear existing classes
        document.body.classList.add(`group-${currentGroup}`);
        
        // Set CSS variables based on the current group
        if (currentGroup === 1) {
            document.documentElement.style.setProperty('--color', '#DEEAF6');
            document.documentElement.style.setProperty('--hover', '#C9D8F0');
            document.documentElement.style.setProperty('--arrow-bg', 'rgba(222, 234, 246, 0.2)');
            document.documentElement.style.setProperty('--arrow-bg-hover', 'rgba(222, 234, 246, 0.7)'); // Darker hover color
        } else if (currentGroup === 2) {
            document.documentElement.style.setProperty('--color', '#FEF2CB');
            document.documentElement.style.setProperty('--hover', '#FDE4A3');
            document.documentElement.style.setProperty('--arrow-bg', 'rgba(254, 242, 203, 0.2)');
            document.documentElement.style.setProperty('--arrow-bg-hover', 'rgba(254, 242, 203, 0.7)'); // Darker hover color
        } else if (currentGroup === 3) {
            document.documentElement.style.setProperty('--color', '#E2EFD9');
            document.documentElement.style.setProperty('--hover', '#CDE8B3');
            document.documentElement.style.setProperty('--arrow-bg', 'rgba(226, 239, 217, 0.2)');
            document.documentElement.style.setProperty('--arrow-bg-hover', 'rgba(226, 239, 217, 0.7)'); // Darker hover color
        }
    }

    function updateArrows() {
        if (currentGroup === 1) {
            leftButton.style.opacity = '0.3';
            leftButton.classList.add('disabled');
        } else {
            leftButton.style.opacity = '1';
            leftButton.classList.remove('disabled');
        }

        if (currentGroup === 3) {
            rightButton.style.opacity = '0.3';
            rightButton.classList.add('disabled');
        } else {
            rightButton.style.opacity = '1';
            rightButton.classList.remove('disabled');
        }
    }

    function updateArrowButtonsVisibility() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.arrow-button').forEach(button => button.style.display = 'block');
        } else {
            document.querySelectorAll('.arrow-button').forEach(button => button.style.display = 'none');
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

                    const courseInstructorContainer = document.createElement('div');
                    courseInstructorContainer.className = 'course-instructor-container';

                    const courseElement = document.createElement('div');
                    courseElement.className = 'course';
                    courseElement.textContent = slot.course;

                    const instructorElement = document.createElement('div');
                    instructorElement.className = 'instructor';
                    instructorElement.textContent = slot.instructor;

                    courseInstructorContainer.appendChild(courseElement);
                    courseInstructorContainer.appendChild(instructorElement);
                    slotCell.appendChild(courseInstructorContainer);

                    if (slot.earlyStart) {
                        slotCell.classList.add('early-start');
                        slotCell.setAttribute('data-time1', '8:00');
                    }
                    if (slot.earlyFinish) {
                        slotCell.classList.add('early-finish');
                        slotCell.setAttribute('data-time', '12:00');
                    }

                    // Handle merged cells
                    if (slot.colspan === 2) {
                        slotCell.setAttribute('colspan', slot.colspan);
                        courseInstructorContainer.classList.add('merged');
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

    function highlightCurrentDay() {
        const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const today = new Date().getDay();
        const todayName = daysOfWeek[today];

        const rows = document.querySelectorAll('#timetable tbody tr');
        rows.forEach(row => {
            const dayCell = row.querySelector('.time-slot');
            if (dayCell && dayCell.textContent === todayName) {
                row.classList.add('ring-of-fire');
            } else {
                row.classList.remove('ring-of-fire');
            }
        });
    }

    // Initially hide the timetable and show the group selection
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.container1').style.display = 'block';
    updateArrowButtonsVisibility(); // Ensure arrow buttons are correctly shown/hidden on initial load
    highlightCurrentDay(); // Highlight the current day on initial load
});

// Define timetable data for groups
const group1Data = [
    {
        day: "Lundi",
        slots: [
            { course: "TP AGL C# (6-11)", instructor: "Hachmoud (24h) F14", className: "color-1", earlyStart: true, earlyFinish: true, colspan: 2},
            { course: "Org. des Entreprises (6-15)", instructor: "Bartat (20H)", className: "color-empty" },
            { course: "Tech. Rech. d'Emploi (6-16)", instructor: "Belkhou (20H)", className: "color-empty" }
        ]
    },
    {
        day: "Mardi",
        slots: [
            { course: "TP Gest. projets (6-10)", instructor: "Gmira (20H) F11", className: "color-2", colspan: 2 },
            { course: "TP OSI & TCP/IP (6-10)", instructor: "Khartoch (20H) F13", className: "color-4", colspan: 2 }
        ]
    },
    {
        day: "Mercredi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty", colspan: 2},
            { course: "TP Prog. Java (6-12)", instructor: "Benslimane (28H) F14", className: "color-5", colspan: 2 }
        ]
    },
    {
        day: "Jeudi",
        slots: [
            { course: "entrepreneuriat (6-16)", instructor: "Lazaar (22H)", className: "color-empty" },
            { course: "OSI & TCP/IP (1-7)", instructor: "Khartoch (14H)", className: "color-empty" },
            { course: "TP Tech. Web (6-10)", instructor: "Tmimi (20H) F14", className: "color-3", colspan: 2 }
        ]
    },
    {
        day: "Vendredi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty", colspan: 2},
            { course: " ", instructor: " ", className: "color-empty", colspan: 2}
        ]
    }
];

const group2Data = [
    {
        day: "Lundi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty", colspan: 2},
            { course: "Org. des Entreprises (6-15)", instructor: "Bartat (20H)", className: "color-empty" },
            { course: "Tech. Rech. d'Emploi (6-16)", instructor: "Belkhou (20H)", className: "color-empty" }
        ]
    },
    {
        day: "Mardi",
        slots: [
            { course: "TP AGL C# (6-11)", instructor: "Hachmoud (24h) F14", className: "color-1", earlyStart: true, earlyFinish: true, colspan: 2},
            { course: "TP Gest. projets (6-10)", instructor: "Gmira (20H) F12", className: "color-2", colspan: 2 }
        ]
    },
    {
        day: "Mercredi",
        slots: [
            { course: "TP OSI & TCP/IP (6-10)", instructor: "Khartoch (20H) F13", className: "color-4", colspan: 2 },
            { course: "TP Tech. Web (6-10)", instructor: "Tmimi (20H) F13", className: "color-3", colspan: 2 }
        ]
    },
    {
        day: "Jeudi",
        slots: [
            { course: "entrepreneuriat (6-16)", instructor: "Lazaar (22H)", className: "color-empty" },
            { course: "OSI & TCP/IP (1-7)", instructor: "Khartoch (14H)", className: "color-empty" },
            { course: "TP Prog. Java (6-12)", instructor: "Benslimane (20H) F12", className: "color-5", colspan: 2 }
        ]
    },
    {
        day: "Vendredi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty", colspan: 2},
            { course: " ", instructor: " ", className: "color-empty", colspan: 2}
            ]
    }
];
const group3Data = [
    {
        day: "Lundi",
        slots: [
            { course: "TP Gest. projets (6-10)", instructor: "Gmira (20H) F11", className: "color-2", colspan: 2 },
            { course: "Org. des Entreprises (6-15)", instructor: "Bartat (20H)", className: "color-empty" },
            { course: "Tech. Rech. d'Emploi (6-16)", instructor: "Belkhou (20H)", className: "color-empty" }
        ]
    },
    {
        day: "Mardi",
        slots: [
            { course: "TP OSI & TCP/IP (6-10)", instructor: "Khartoch (20H) F13", className: "color-4", colspan: 2 },
            { course: "TP Prog. Java (6-12)", instructor: "Benslimane (20H) F14", className: "color-5", colspan: 2 }
        ]
    },
    {
        day: "Mercredi",
        slots: [
            { course: "TP Tech. Web (6-10)", instructor: "Tmimi (20H) F11", className: "color-3", colspan: 2 },
            { course: " ", instructor: " ", className: "color-empty", colspan: 2}
        ]
    },
    {
        day: "Jeudi",
        slots: [
            { course: "entrepreneuriat (6-16)", instructor: "Lazaar (22H)", className: "color-empty" },
            { course: "OSI & TCP/IP (1-7)", instructor: "Khartoch (14H)", className: "color-empty" },
            { course: " ", instructor: " ", className: "color-empty", colspan: 2}
        ]
    },
    {
        day: "Vendredi",
        slots: [
            { course: "TP AGL C# (6-11)", instructor: "Hachmoud (24h) F14", className: "color-1", earlyStart: true, earlyFinish: true, colspan: 2},
            { course: " ", instructor: " ", className: "color-empty", colspan: 2}
        ]
    }
];