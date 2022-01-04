var urlParams = new URLSearchParams(window.location.search);
var urlRevenus = urlParams.get('revenus'); var urlAge = urlParams.get('age'); var urlInitial = urlParams.get('initial'); var urlMensual = urlParams.get('mensual'); var urlSituation = urlParams.get('situation'); var urlChild = urlParams.get('child'); var urlPro = urlParams.get('pro'); var urlFinanceLevel = urlParams.get('financeLevel'); var urlToSave = urlParams.get('toSave'); var urlToCall = urlParams.get('toCall'); var s = urlParams.get('s');
var ph = urlParams.get('phoneNumber'); if (ph && !!ph.length) { var urlPhone = window.atob(ph) }; var em = urlParams.get('email'); if (em && !!em.length) { var urlEmail = window.atob(em) };
let resultsToSend = {};
$('#params').val(JSON.stringify({ "situationPerso": urlSituation, "situationPro": urlPro, "child": urlChild, "financeLevel": urlFinanceLevel }));

// /SEGMENT
var tr = urlParams.get('notrack');
if (tr !== "true") {
    analytics.track('Simulation Completed', {
        Age: urlAge,
        RevenusMensuels: urlRevenus,
        VersementInitial: urlInitial,
        VersementMensuel: urlMensual,
        SituationPerso: urlSituation,
        SituationPro: urlPro,
        EnfantsACharge: urlChild,
        FinanceLevel: urlFinanceLevel,
        RecevoirParEmail: urlToSave,
        RappelTelephone: urlToCall,
        Simulateur: s
    })

    window.setTimeout(function () { analytics.track('Simulation Engagement') }, 15000);

};

$('#leftCta, #centerCta, #topCta, #meeting, #votreSimulationCta, #startNowCta').click(function () { analytics.track('Simulation CTA Clicked', { CTA: this.id }) }); $('.sim-v2-collapsable-section-wrapper').one('click', function () { analytics.track('Simulation Collapse Clicked', { Section: this.id }) });
$('.increment-button').one('click', function () { analytics.track('Simulation Plus/Minus Clicked') });
$("#age").val(urlAge); $("#revenus").val(urlRevenus); $("#mensual").val(urlMensual); $("#initial").val(urlInitial);

$("#add2").click(function () { document.getElementById("initial").stepUp() }), $("#sub2").click(function () { document.getElementById("initial").stepDown() }), $("#add3").click(function () { document.getElementById("mensual").stepUp() }), $("#sub3").click(function () { document.getElementById("mensual").stepDown() });


var runSim = function compute() {
    function currency(e) { return e.toLocaleString('en').replace(',', ' ') + " €" }

    //values
    const revenues = parseInt(document.getElementById('revenus').value);
    const age = parseInt(document.getElementById('age').value);
    const monthlyDeposit = parseInt(document.getElementById('mensual').value);
    const firstDeposit = parseInt(document.getElementById('initial').value);
    const annualDeposit = Math.round(12 * monthlyDeposit);
    const rate = 0.05;
    const t = 63 - age;
    var myData = [];
    var dataYears = [];
    var dataDeposits = [];
    var dataInterests = [];
    var dataFv = [];


    //CalcFV
    let generatedInterests = 0;
    let annualAmount = 0;
    let md = 0;
    let fv = 0;
    let deposit = 0;
    for (let i = 1; i <= t; i++) {
        if (i == 1)
            deposit = firstDeposit + annualDeposit;
        else
            deposit = fv + annualDeposit;

        let interests = deposit * rate;
        generatedInterests += interests;
        fv = deposit + interests;
        dataFv.push(Math.round(fv));
        dataYears.push(2021 + i);
        dataDeposits.push(Math.round(fv - generatedInterests));
        dataInterests.push(Math.round(generatedInterests));
        myData.push([
            i, Math.round(fv - generatedInterests),
            Math.round(generatedInterests)
        ])
    }


    generatedInterests = Math.round(generatedInterests);
    fv = Math.round(fv);
    fvMin = Math.round(fv * 0.8);
    fvMax = Math.round(fv * 1.1);

    //CalcFVM
    const fvMensual = Math.round(fv / (12 * 20));

    //CalcInterests 
    const totalDeposit = Math.round(+firstDeposit + (+annualDeposit * t));

    //FiscalCalc
    let fiscalSimulation = taxCompute(revenues, firstDeposit, annualDeposit);
    let firstYearDeposit = +firstDeposit + +annualDeposit;


    //FiscalForm
    function taxCompute() {
        let annualNetIncome = revenues * 12; let fiscalReferenceIncome = Math.round(annualNetIncome * 0.9); function computeTax(fiscalReferenceIncome) { if (fiscalReferenceIncome < 10084) { return 0 } if (fiscalReferenceIncome < 25710) { return (fiscalReferenceIncome - 10085) * 0.11 } if (fiscalReferenceIncome < 73516) { return (fiscalReferenceIncome - 25711) * 0.3 + 1719 } if (fiscalReferenceIncome < 158122) { return (fiscalReferenceIncome - 73517) * 0.41 + 16060 } return (fiscalReferenceIncome - 158123) * 0.45 + 50748 } function computeTmi(fiscalReferenceIncome) { if (fiscalReferenceIncome < 10084) { return tmi = "0%" } if (fiscalReferenceIncome < 25710) { return tmi = "11%" } if (fiscalReferenceIncome < 73516) { return tmi = "30%" } if (fiscalReferenceIncome < 158122) { return tmi = "41%" } if (fiscalReferenceIncome > 158123) { return tmi = "45%" } } let marginalIncomeTax = computeTmi(fiscalReferenceIncome); let YearlyTaxToPay = Math.round(computeTax(fiscalReferenceIncome)); let plafond = fiscalReferenceIncome * 0.1; function calculatePlafond(fiscalReferenceIncome) { if (plafond < 4114) { return plafond = 4114 } if (plafond > 4114 && plafond < 32912) { return plafond = fiscalReferenceIncome * 0.1 } if (plafond > 32912) { return plafond = 32912 } } maxDeduction = calculatePlafond(fiscalReferenceIncome); taxDeduction = Math.min(annualDeposit, maxDeduction); var newTaxToPay = computeTax(fiscalReferenceIncome - taxDeduction); taxGain = Math.round(YearlyTaxToPay - newTaxToPay); initialTaxDeduction = Math.min((firstDeposit + annualDeposit), maxDeduction); var initialNewTaxToPay = computeTax(fiscalReferenceIncome - initialTaxDeduction); initialTaxGain = Math.round(YearlyTaxToPay - initialNewTaxToPay); let realCost = totalDeposit - ((taxGain * t) + initialTaxGain); savingsEffort = annualDeposit - taxGain; monthlySavingsEffort = Math.round(savingsEffort / 12);

        $('#DfiscalReferenceIncome').text(currency(fiscalReferenceIncome));
        $('#DYearlyTaxToPay').text(currency(YearlyTaxToPay));
        $('#DmaxDeduction').text(currency(maxDeduction));
        $('#DmarginalIncomeTax, #TMI2, #TMI3').text(marginalIncomeTax)

        //SectTax
        let tmiNumber = parseInt(marginalIncomeTax) / 100;
        let taxGainDeposit = Math.round((monthlyDeposit / (1 - tmiNumber)));
        $('#taxGainDeposit').text(currency(taxGainDeposit));

        return taxGain;
        return initialTaxGain
    }

    //

    //Top
    $('#mensualRecap, #mensualTax, #mensualRecapBottom, #MensualHint, #mdA').text(currency(monthlyDeposit));
    $('#fvMensualRecap').text(`${Math.round(fv / (12 * 20))} €`)
    $('#fvRecap, #decayFvToday').text(currency(fv));
    $('#ageA').text(age); $('#ageB').text(age + 10); $('#mdB').text(currency(monthlyDeposit * 2));

    //Bottom
    $('#generatedInterests, #decayGeneratedInterestsToday').text(currency(generatedInterests));
    $('#totalSavings, #decayTotalDepositToday').text(currency(totalDeposit));
    $('#t-cotis').text(t)
    $('#totalFiscalGain').text(((taxGain * t) + initialTaxGain).toLocaleString('en').replace(',', ' ') + " €")
    $('#taxGain').text(currency(taxGain));


    //SectPerf
    $('#fvMax').text(currency(fvMax));
    $('#fvMensualMax').text(`${Math.round(fvMax / (12 * 20))} €`)
    $('#fvMin').text(currency(fvMin));
    $('#fvMensualMin').text(`${Math.round(fvMin / (12 * 20))} €`)

    //SectTax
    $('#initialTaxGain, #initialTaxGain2').text(currency(initialTaxGain));
    $('#firstYearDeposit').text(currency(firstYearDeposit));
    $('#monthlySavingsEffort, #mseHint').text(currency(monthlySavingsEffort));

    //PerteRevenu
    if (urlPro == "employed") {
        $("#pSituation").text('salarié');
        $('#pLoss').text('36,8%');
        $('#pRevenu').text(currency(Math.round(revenues * 0.632)));
        $('#pRevenuC').text(currency(fvMensual + Math.round(revenues * 0.632)));
        $('#agirSalarie').removeClass("hidden");
    } else if (urlPro == "tns") {
        $("#pSituation").text('indépendant');
        $('#pLoss').text('50%');
        $('#pRevenu').text(currency(Math.round(revenues * 0.5)));
        $('#pRevenuC').text(currency(fvMensual + Math.round(revenues * 0.5)));
        $('#agirTns').removeClass("hidden");
    } else {
        $('#pRevenu').text(currency(Math.round(revenues * 0.5)));
        $('#pRevenuC').text(currency(fvMensual + Math.round(revenues * 0.5)))
    };
    $('#fvMpension').text("+" + fvMensual + "€");



    //ConstructJSONResult
    let resultsToPush = JSON.stringify({ "age": age, "revenus": revenues, "vInitial": firstDeposit, "vMensuel": monthlyDeposit, "t": t, "fv": fv, "fvMin": fvMin, "fvMax": fvMax, "fvMensual": fvMensual, "totalSavings": totalDeposit, "generatedInterests": generatedInterests, "totalFiscalGain": (taxGain * t) + initialTaxGain, "firstYearDeposit": firstYearDeposit, "initialTaxGain": initialTaxGain, "monthlySavingsEffort": monthlySavingsEffort });
    $('#results').val(resultsToPush);
    Object.defineProperty(resultsToSend, "results", { value: resultsToPush, writable: true });

    //ApexCharts
    var apexOptions = { chart: { stacked: true, zoom: { enabled: false }, height: "400px", toolbar: { show: false } }, dataLabels: { enabled: false }, colors: ['#ffe5a3', '#76ebe4', '2D2A47'], series: [{ name: 'Versements cumulés', type: 'column', color: '#ffe5a3', data: dataDeposits }, { name: 'Intérêts cumulés', type: 'column', data: dataInterests }, { name: 'Montant total', type: 'line', color: '#2D2A47', data: dataFv }], stroke: { curve: 'straight' }, legend: { horizontalAlign: 'left', position: 'top' }, xaxis: { categories: dataYears, labels: { rotate: 0 } }, yaxis: { max: function (max) { return Math.round((max / 2 + 1000) / 1000) * 1000 }, labels: { formatter: function (value) { return value.toLocaleString('en').replace(',', ' ') + " €" } } } }; var chart = new ApexCharts(document.querySelector("#chart"), apexOptions); chart.render(); chart.updateOptions(apexOptions);
};


//Call the function  
$(document).ready(runSim);
$("#cta, #sub1, #sub2, #sub3, #sub4, #add1, #add2, #add3, #add4").click(runSim);
$('.inline-div-field').change(runSim);

//SimulationSaver
window.setTimeout(function () { var post = window.localStorage.getItem("sent"); if (!post) { window.localStorage.setItem("sent", "true"); let hookUrl = "https://hook.integromat.com/i11avicngpodnczi1wk781hh2rp2bcvt"; if (urlEmail) { $.post(hookUrl, { "Email": urlEmail, "params": $('#params').val(), "results": resultsToSend.results, "source": $('#source').val(), "phone": urlPhone }) }; if (urlPhone && !urlEmail) { $.post(hookUrl, { "params": $('#params').val(), "results": resultsToSend.results, "source": $('#source').val(), "phone": urlPhone }) } } else { console.log("already posted") } }, 500);

//format Currency Function
function currency(e) { return e.toLocaleString('en').replace(',', ' ') + " €" }


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
    $('#decay').text(this.value);

    let ageB = +age + b

    let resultA = simulation(age, initial, mensual)
    let resultB = simulation(ageB, initial, mensual)

    var decayFv = currency(resultB.fv); $('#decayFv').text(decayFv);
    var decayFvDif = currency(resultB.fv - resultA.fv); $('#decayFvDif').text(decayFvDif)

    var decayTotalDeposit = currency(resultB.totalDeposit); $('#decayTotalDeposit').text(decayTotalDeposit)
    var decayTotalDepositDif = currency(resultB.totalDeposit - resultA.totalDeposit); $('#decayTotalDepositDif').text(decayTotalDepositDif);

    var decayGeneratedInterests = currency(resultB.generatedInterests); $('#decayGeneratedInterests').text(decayGeneratedInterests);
    var decayGeneratedInterestsDif = currency(resultB.generatedInterests - resultA.generatedInterests); $('#decayGeneratedInterestsDif').text(decayGeneratedInterestsDif);


});

let calculDecay = function (d) {

    let initial = parseInt(document.getElementById('initial').value);
    let mensual = parseInt(document.getElementById('mensual').value);

    let age = parseInt($('#age').val());
    let b = parseInt(d);
    $('#decay').text(d);

    let ageB = +age + b

    let resultA = simulation(age, initial, mensual)
    let resultB = simulation(ageB, initial, mensual)

    var decayFv = currency(resultB.fv); $('#decayFv').text(decayFv);
    var decayFvDif = currency(resultB.fv - resultA.fv); $('#decayFvDif').text(decayFvDif)

    var decayTotalDeposit = currency(resultB.totalDeposit); $('#decayTotalDeposit').text(decayTotalDeposit)
    var decayTotalDepositDif = currency(resultB.totalDeposit - resultA.totalDeposit); $('#decayTotalDepositDif').text(decayTotalDepositDif);

    var decayGeneratedInterests = currency(resultB.generatedInterests); $('#decayGeneratedInterests').text(decayGeneratedInterests);
    var decayGeneratedInterestsDif = currency(resultB.generatedInterests - resultA.generatedInterests); $('#decayGeneratedInterestsDif').text(decayGeneratedInterestsDif);


};

$(document).ready(function () {
    calculDecay(2);
});
