$(document).ready(() => {
    if (localStorage.getItem("cages")) {
        const cages = JSON.parse(localStorage.getItem("cages"));
        cages.forEach((index) => {
            $("#cages").append('<li><input type="radio" name="c" value="' + index + '">' + index + '</li>');
        });
    }

    if (localStorage.getItem("record")) {
        const record = JSON.parse(localStorage.getItem("record"));
        record.forEach((index) => {
            let deurationA = new Date(index[3]).getTime()-new Date(index[2]).getTime();
            let deurationB = new Date(index[5]).getTime()-new Date(index[4]).getTime();
            let deurationC = new Date(index[7]).getTime()-new Date(index[6]).getTime();
            deurationA /= 1000;
            deurationB /= 1000;
            deurationC /= 1000;
            let tr = '<tr style="text-align: right;">' +
                '<td>' + index[1] + '</td>' +
                '<td>' + deurationA.toFixed(2) + 's</td>' +
                '<td>' + deurationB.toFixed(2) + 's</td>' +
                '<td>' + deurationC.toFixed(2) + 's</td>' +
                '</tr>';
            $('#record > tbody:last-child').append(tr);
        });
    }
})

const add = document.getElementById("add");

add.addEventListener("click", () => {
    const name = document.getElementById("name").value;
    if (localStorage.getItem("cages")) {
        const cages = JSON.parse(localStorage.getItem("cages"));
        cages.push(name);
        localStorage.setItem("cages", JSON.stringify(cages));
    } else {
        localStorage.setItem("cages", JSON.stringify([]));
        const cages = JSON.parse(localStorage.getItem("cages"));
        cages.push(name);
        localStorage.setItem("cages", JSON.stringify(cages));
    }
    $("#cages").append('<li><input type="radio" name="c" value="' + name + '">' + name + '</li>');
})

const ws = document.getElementsByName('ws');
const c = document.getElementsByName('c');

let station = cage = null;

ws.forEach((index, i) => {
    index.addEventListener("change", () => {
        station = i;
    })
});

c.forEach((index, i) => {
    index.addEventListener("change", () => {
        cage = i;
    })
});

const start = document.getElementById("start");
const end = document.getElementById("end");

start.addEventListener("click", () => {
    station = $("input[name='ws']:checked").val();
    cage = $("input[name='c']:checked").val();
    if (cage != null && station != null) {
        const startTime = Date.now();
        if (!localStorage.getItem(`${station}-${cage}start`, startTime)) {
            localStorage.setItem(`${station}-${cage}start`, startTime);
        }
    }
});

end.addEventListener("click", () => {
    station = $("input[name='ws']:checked").val();
    cage = $("input[name='c']:checked").val();
    if (cage != null && station != null) {
        if (localStorage.getItem(`${station}-${cage}start`)) {
            const endTime = Date.now();
            if (!localStorage.getItem(`${station}-${cage}end`, endTime)) {
                localStorage.setItem(`${station}-${cage}end`, endTime);
            }
            const start = new Date(parseInt(localStorage.getItem(`${station}-${cage}start`)));
            const end = new Date(parseInt(localStorage.getItem(`${station}-${cage}end`)));
            let record;

            if (localStorage.getItem('record')) {
                let x = 0;
                record = JSON.parse(localStorage.getItem('record'));
                record.forEach((index) => {
                    if (cage == index[1] && station != index[0]) {
                        if (station == 'A' && index[3] == "") {
                            index[2] = start;
                            index[3] = end;
                            x++;
                        } else if (station == 'B' && index[5] == "") {
                            index[4] = start;
                            index[5] = end;
                            x++;
                        } else if (station == 'C' && index[7] == "") {
                            index[6] = start;
                            index[7] = end;
                            x++;
                        }
                    }
                })
                if (!x) {
                    let entry = [station, cage, "", "", "", "", "", ""]
                    if (station == 'A') {
                        entry[2] = start;
                        entry[3] = end;
                    } else if (station == 'B') {
                        entry[4] = start;
                        entry[5] = end;
                    } else if (station == 'C') {
                        entry[6] = start;
                        entry[7] = end;
                    }
                    record.push(entry);
                }
            } else {
                record = [];
                let entry = [station, cage, "", "", "", "", "", ""]
                if (station == 'A') {
                    entry[2] = start;
                    entry[3] = end;
                } else if (station == 'B') {
                    entry[4] = start;
                    entry[5] = end;
                } else if (station == 'C') {
                    entry[6] = start;
                    entry[7] = end;
                }
                record.push(entry);
            }
            localStorage.setItem('record', JSON.stringify(record));
            localStorage.removeItem(`${station}-${cage}start`);
            localStorage.removeItem(`${station}-${cage}end`);
            location.reload();
        }
    }
});