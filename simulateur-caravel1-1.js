// SimulateDecalage
let simulation = function (age, firstDeposit, monthlyDeposit) {
    let fv = 0; let deposit = 0; let generatedInterests = 0;
    let t = (63 - age); let annualDeposit = monthlyDeposit * 12;
    for (let i = 1; i <= t; i++) { if (i == 1) deposit = firstDeposit + annualDeposit; else deposit = fv + annualDeposit; let interests = deposit * 0.05; generatedInterests += interests; fv = deposit + interests }
    let totalDeposit = Math.round(+firstDeposit + (+annualDeposit * t));
    return { "fv": Math.round(fv), "totalDeposit": Math.round(totalDeposit), "generatedInterests": Math.round(generatedInterests) };
};

$('#selectDecay').change(function () {

    let initial = parseInt(document.getElementById('initial').value);
    let mensual = parseInt(document.getElementById('mensual').value);

    let age = parseInt($('#age').val());
    let b = parseInt(this.value);

    let ageB = +age + b

    let resultA = simulation(age, initial, mensual)
    let resultB = simulation(ageB, initial, mensual)

    var decayFv = currency(resultB.fv); $('#decayFv').text(decayFv);
    var decayFvDif = currency(resultB.fv - resultA.fv); $('#decayFvDif').text(decayFvDif)

    var decayTotalDeposit = currency(resultB.totalDeposit); $('#decayTotalDeposit').text(decayTotalDeposit)
    var decayTotalDepositDif = currency(resultB.totalDeposit - resultA.totalDeposit); $('#decayTotalDepositDif').text(decayTotalDepositDif);

    var decayGeneratedInterests = currency(resultB.generatedInterests); $('#decayGeneratedInterests').text(decayGeneratedInterests);
    var decayGeneratedInterestsDif = currency(resultB.generatedInterests - resultA.generatedInterests);$('#decayGeneratedInterestsDif').text(decayGeneratedInterestsDif);


});
