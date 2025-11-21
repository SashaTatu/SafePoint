const regionUID = {
    "vinnytska": 4,
    "dnipropetrovska": 9,
    "volynska": 8,
    "donetska": 28,
    "zhytomyrska": 10,
    "zakarpatska": 11,
    "zaporizka": 12,
    "ivano-frankivska": 13,
    "kyivska": 14,
    "kirovohradska": 15,
    "luhanska": 16,
    "lvivska": 27,
    "mykolaivska": 17,
    "odeska": 18,
    "poltavska": 19,
    "rivnenska": 5,
    "sumska": 20,
    "ternopilska": 21,
    "kharkivska": 22,
    "khersonska": 23,
    "khmelnytska": 3,
    "cherkaska": 24,
    "chernivetska": 26,
    "chernihivska": 25,
    "kyiv": 31,
    "sevastopol": 30,
    "crimea": 29
};

document.querySelector('#region').addEventListener('change', function() {
    const value = this.value;
    const uid = regionUID[value];
});


