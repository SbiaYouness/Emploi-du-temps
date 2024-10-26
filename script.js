document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    const groupButtons = document.querySelectorAll('.buttons1 button');
    let currentGroup = 1;
    let startX;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) { // Ensure only one finger is used
            startX = e.touches[0].clientX;
        }
    });

    container.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1 && e.touches.length === 0) { // Ensure only one finger is used
            const endX = e.changedTouches[0].clientX;
            if (startX > endX + 50) {
                loadNextGroupTimetable();
            } else if (startX < endX - 50) {
                loadPreviousGroupTimetable();
            }
        }
    });

    leftButton.addEventListener('click', loadPreviousGroupTimetable);
    rightButton.addEventListener('click', loadNextGroupTimetable);

    groupButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentGroup = parseInt(button.id.replace('G', ''));
            document.querySelector('.container1').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
            document.querySelectorAll('.arrow-button').forEach(button => button.style.display = 'block');
            updateTimetable();
        });
    });

    function loadNextGroupTimetable() {
        if (currentGroup < 3) {
            currentGroup++;
            updateTimetable();
        }
    }

    function loadPreviousGroupTimetable() {
        if (currentGroup > 1) {
            currentGroup--;
            updateTimetable();
        }
    }

    function updateTimetable() {
        document.querySelector('.tilted-sticker').textContent = `G${currentGroup}`;
        fillTimetable(currentGroup === 1 ? group1Data : currentGroup === 2 ? group2Data : group3Data);
        updateArrows();
        updateBackgroundColor();
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
                        slotCell.setAttribute('data-time', '8:00');
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

    // Initially hide the timetable and show the group selection
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.container1').style.display = 'block';
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