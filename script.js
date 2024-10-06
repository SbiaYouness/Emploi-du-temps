const timetableData = [
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
            { course: "Droit Social (+5)", instructor: "(10H)", className: "color-uncertain" },
            { course: "OSI & TCP/IP (+2)", instructor: "Khartoch (4H)", className: "color-3" },
            { course: " ", instructor: " ", className: "color-empty" },
            { course: " ", instructor: " ", className: "color-empty" }
        ]
    },
    {
        day: "Mercredi",
        slots: [
            { course: " ", instructor: " ", className: "color-empty" },
            { course: "OSI & TCP/IP (+2)", instructor: "Khartoch (4H)", className: "color-3" },
            { course: "Program. Java (+2)", instructor: "Benslimane (4H) D12", className: "color-4" },
            { course: "Program. Java (+2)", instructor: "Benslimane (4H) D12", className: "color-4" }
        ]
    },
    {
        day: "Jeudi",
        slots: [
            { course: "Droit Social (+5)", instructor: "(10H)", className: "color-uncertain" },
            { course: "OSI & TCP/IP (+4)", instructor: "Khartoch (8H)", className: "color-3" },
            { course: "Technologie Web (+2)", instructor: "Tmimi (4H)", className: "color-5" },
            { course: "Technologie Web (+2)", instructor: "Tmimi (4H)", className: "color-5" }
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

// Fonction pour remplir le tableau avec les données
function fillTimetable() {
    const timetableBody = document.querySelector('#timetable tbody');
    timetableData.forEach((dayData, index) => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = dayData.day;
        dayCell.className = 'time-slot';
        row.appendChild(dayCell);
        
        dayData.slots.forEach(slot => {
            const slotCell = document.createElement('td');
            if (slot.course !== " ") {
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
            } else {
                slotCell.className = 'color-empty';
            }
            row.appendChild(slotCell);
        });

        timetableBody.appendChild(row);
    });
}

// Appel de la fonction pour remplir le tableau
fillTimetable();
