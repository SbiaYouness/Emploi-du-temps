document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const groupButtons = document.querySelectorAll('.buttons1 button');
    const slider = document.getElementById('slider');
    const sliderContainer = document.querySelector('.slider-container');
    const returnButton = document.querySelector('.return-button');
    let currentGroup = 1;

    function updateSlider(value) {
        slider.value = value; // Update the slider value
        const percent = (value / 2) * 100;
        slider.style.background = `linear-gradient(to right, var(--color) ${percent}%, #e2e8f0 ${percent}%)`;
    }

    slider.addEventListener('input', (e) => {
        updateSlider(parseInt(e.target.value));
        currentGroup = parseInt(e.target.value) + 1;
        updateTimetable();
    });

    slider.addEventListener('touchstart', () => {
        slider.style.transform = 'scale(1.02)';
    });

    slider.addEventListener('touchend', () => {
        slider.style.transform = 'scale(1)';
    });

    groupButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentGroup = parseInt(button.id.replace('G', ''));
            document.querySelector('.container1').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
            sliderContainer.style.display = 'flex'; // Show the slider
            updateSlider(currentGroup - 1); // Synchronize the slider thumb
            updateTimetable();
        });
    });

    returnButton.addEventListener('click', () => {
        document.querySelector('.container').style.display = 'none';
        sliderContainer.style.display = 'none';
        document.querySelector('.container1').style.display = 'block';
    });

    function updateTimetable() {
        document.querySelector('.tilted-sticker').textContent = `G${currentGroup}`;
        fillTimetable(currentGroup === 1 ? group1Data : currentGroup === 2 ? group2Data : currentGroup === 3 ? group3Data : []);
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
        } else if (currentGroup === 2) {
            document.documentElement.style.setProperty('--color', '#FEF2CB');
            document.documentElement.style.setProperty('--hover', '#FDE4A3');
        } else if (currentGroup === 3) {
            document.documentElement.style.setProperty('--color', '#E2EFD9');
            document.documentElement.style.setProperty('--hover', '#CDE8B3');
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

                    // Handle exam indicator
                    if (slot.className.includes('exam')) {
                        const examLabel = document.createElement('span');
                        examLabel.className = 'exam-label';
                        examLabel.textContent = 'EXAM';
                        slotCell.appendChild(examLabel);
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

    // Function to add a class to specific courses on a specific day for all groups
    function addClassToCourses(courseName, className) {
        [group1Data, group2Data, group3Data].forEach(groupData => {
            groupData.forEach(day => {
                day.slots.forEach(slot => {
                    if (slot.course.includes(courseName)) {
                        slot.className += ` ${className}`;
                        slot.className += ' blink-border'; // Add the blink-border class

                    }
                });
            });
        });
    }

    // Example usage: Add "exam" class to OSI & TCP/IP courses
    addClassToCourses("OSI & TCP/IP (1-7)", "exam");
    // addClassToCourses("TP Tech", "exam");

    // Initially hide the timetable and slider, and show the group selection
    document.querySelector('.container').style.display = 'none';
    sliderContainer.style.display = 'none';
    document.querySelector('.container1').style.display = 'block';
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
            { course: "TP Prog. Java (6-12)", instructor: "Benslimane (20H) F12", className: "color-5", colspan: 2 }
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