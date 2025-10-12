const { jsPDF } = window.jspdf;

function rankDropDown(rank){
    var template = `
        <option value="${rank}">${rank}</option>
    `;

    return $(template);
}

function checkBoxTemplate(name){
    var template = `
        <div class="checkbox">
            <input type="checkbox" id="${name}" name="${name}">
            <label for="${name}">${name}</label><br> 
        </div>
    `

    return $(template);
}

$.ajax({
    url: './js/cadetInformation.json',
    dataType: 'json',
    success: function(data){
        var jsonData = data;
        
        var courses = jsonData["courses"];
        var courseTemplates = $();

        var qualifications = jsonData["qualifications"];
        var qualificationTemplates = $();

        var awards = jsonData["awards"];
        var awardTemplates = $();

        $("input[name='branch']").change(function(){
            $('#ranks').children().remove();

            var branchKey = $("input[name='branch']:checked").attr('id');

            var branch = jsonData["ranks"][branchKey];

            var rankTemplates = $();

            for(var rank in branch){
                rankTemplates = rankTemplates.add(rankDropDown(rank));
            }

            rankTemplates.appendTo('#ranks');
        });

        $("#genPdf").on('click', function(){
            var selectedCourses = $("#courses input[type='checkbox']:checked").map(function() {return this.id;}).get();
            var selectedQualifications = $("#qualifications input[type='checkbox']:checked").map(function() {return this.id;}).get();
            var selectedAwards = $("#awards input[type='checkbox']:checked").map(function() {return this.id;}).get();

            var rank = $("#ranks").val();
            var branchKey = $("input[name='branch']:checked").attr('id');

            var name = $("#name").val();

            const doc = new jsPDF();

            function addSection(title, items, category) {
                doc.setFont(undefined, "bold");
                doc.text(`${title}`, 10, distanceFromTop);

                distanceFromTop += 8;

                doc.setFont(undefined, "normal");
                items.forEach(element => {
                    var text = `${element}: ${jsonData[category][element]}`;
                    var lines = doc.splitTextToSize(text, 180);

                    if(distanceFromTop + lines.length * 7 > 280){
                        doc.addPage();
                    }

                    doc.text(lines, 10, distanceFromTop);
                    distanceFromTop += lines.length * 7 + 3;
                });
            }

            function addRank(title, item, category, branchKey) {
                doc.setFont(undefined, "bold");
                doc.text(`${title}`, 10, distanceFromTop);

                distanceFromTop += 8;

                doc.setFont(undefined, "normal");
                var text = `${item}: ${jsonData[category][branchKey][item]}`;
                var lines = doc.splitTextToSize(text, 180);

                if(distanceFromTop + lines.length * 7 > 280){
                    doc.addPage();
                }

                doc.text(lines, 10, distanceFromTop);
                distanceFromTop += lines.length * 7 + 3;
            }
            
            
            var distanceFromTop = 10;

            doc.setFontSize(14);
            doc.text(`Cadet2Career Resume Summary`, 10, distanceFromTop);

            distanceFromTop += 10;

            doc.setFontSize(12);
            doc.text(`Name: ${name}`, 10, distanceFromTop);

            distanceFromTop += 10;

            addRank("Rank", rank, "ranks", branchKey);
            addSection("Courses", selectedCourses, "courses");
            addSection("Qualifications", selectedQualifications, "qualifications");
            addSection("Awards", selectedAwards, "awards");
            
            doc.save(`${name}_Resume.pdf`);

        });

        for(var course in courses){
            courseTemplates = courseTemplates.add(checkBoxTemplate(course));
        }

        courseTemplates.appendTo("#courses");

        for(var qualification in qualifications){
            qualificationTemplates = qualificationTemplates.add(checkBoxTemplate(qualification));
        }

        qualificationTemplates.appendTo("#qualifications");

        for(var award in awards){
            awardTemplates = awardTemplates.add(checkBoxTemplate(award));
        }

        awardTemplates.appendTo("#awards");
}});
