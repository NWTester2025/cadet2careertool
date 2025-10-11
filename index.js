import {jsPDF}  from "jspdf";

function generatePDF() {
    const doc = new jsPDF();
    const name = document.getElementById("name").value;
    const ranks = Array.from(document.getElementById("ranks").selectedOptions).map(o => o.value);
    const courses = Array.from(document.getElementById("courses").selectedOptions).map(o => o.value);
    const qualifications = Array.from(document.getElementById("qualifications").selectedOptions).map(o => o.value);
    const awards = Array.from(document.getElementById("awards").selectedOptions).map(o => o.value);

    let y = 10;
    doc.setFontSize(14);
    doc.text(`Cadet2Career Resume Summary`, 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 10, y);
    y += 10;

    function addSection(title, items, category) {
    if (items.length > 0) {
        doc.setFont(undefined, "bold");
        doc.text(`${title}:`, 10, y);
        y += 8;
        doc.setFont(undefined, "normal");
        items.forEach(item => {
        const text = `${item}: ${data[category][item]}`;
        const lines = doc.splitTextToSize(text, 180);
        if (y + lines.length * 7 > 280) {
            doc.addPage();
            y = 10;
        }
        doc.text(lines, 10, y);
        y += lines.length * 7 + 3;
        });
    }
    }

    addSection("Ranks", ranks, "ranks");
    addSection("Courses", courses, "courses");
    addSection("Qualifications", qualifications, "qualifications");
    addSection("Awards", awards, "awards");

doc.save(`${name || "Cadet"}_Resume.pdf`);
}

function populateDropdown(id, options) {
    const select = document.getElementById(id);
    for (const key in options) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    select.appendChild(opt);
    }
}

populateDropdown("ranks", data.ranks);
populateDropdown("courses", data.courses);
populateDropdown("qualifications", data.qualifications);
populateDropdown("awards", data.awards);
