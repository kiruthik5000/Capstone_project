const attackTypes = ['DDoS', 'Port Scan', 'Brute Force', 'SQL Injection', 'XSS', 'Malware', 'Phishing'];

function randomIP() {
    return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

let flowCounter = 1000;
const CITY_COORDINATES = {
    // 🇮🇳 India
    chennai: { lat: 13.0827, lng: 80.2707 },
    mumbai: { lat: 19.0760, lng: 72.8777 },
    delhi: { lat: 28.6139, lng: 77.2090 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    hyderabad: { lat: 17.3850, lng: 78.4867 },
    kolkata: { lat: 22.5726, lng: 88.3639 },
    ahmedabad: { lat: 23.0225, lng: 72.5714 },
    jaipur: { lat: 26.9124, lng: 75.7873 },

    // 🇺🇸 USA
    newyork: { lat: 40.7128, lng: -74.0060 },
    losangeles: { lat: 34.0522, lng: -118.2437 },
    chicago: { lat: 41.8781, lng: -87.6298 },
    houston: { lat: 29.7604, lng: -95.3698 },
    sanfrancisco: { lat: 37.7749, lng: -122.4194 },

    // 🇬🇧 UK
    london: { lat: 51.5074, lng: -0.1278 },
    manchester: { lat: 53.4808, lng: -2.2426 },

    // 🇨🇳 China
    beijing: { lat: 39.9042, lng: 116.4074 },
    shanghai: { lat: 31.2304, lng: 121.4737 },

    // 🇯🇵 Japan
    tokyo: { lat: 35.6762, lng: 139.6503 },
    osaka: { lat: 34.6937, lng: 135.5023 },

    // 🇦🇺 Australia
    sydney: { lat: -33.8688, lng: 151.2093 },
    melbourne: { lat: -37.8136, lng: 144.9631 },

    // 🇫🇷 France
    paris: { lat: 48.8566, lng: 2.3522 },

    // 🇩🇪 Germany
    berlin: { lat: 52.5200, lng: 13.4050 },

    // 🇧🇷 Brazil
    saopaulo: { lat: -23.5505, lng: -46.6333 },
    riodejaneiro: { lat: -22.9068, lng: -43.1729 }
};

export function generateLatLong() {
    const cityNames = Object.keys(CITY_COORDINATES);
    const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)];
    return { city: randomCity, lat: CITY_COORDINATES[randomCity].lat, lng: CITY_COORDINATES[randomCity].lng }
}
export function generatePacket() {
    flowCounter++;
    const score = parseFloat((Math.random()).toFixed(3));
    const isAttack = score > 0.75;

    return {
        flowId: `FL-${flowCounter}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        featureVectorSize: 78,
        anomalyScore: score,
        sourceIP: randomIP(),
        attackType: isAttack ? attackTypes[Math.floor(Math.random() * attackTypes.length)] : 'Normal',
        status: isAttack ? 'Attack' : 'Normal',
    };
}

export const modelMetrics = {
    accuracy: 0.9847,
    precision: 0.9812,
    recall: 0.9789,
    f1: 0.9800,
    falseOmissionRate: 0.0811,
    auc: 0.9923,
};

export const confusionMatrix = {
    truePositive: 114383,
    falsePositive: 6597,
    falseNegative: 1432,
    trueNegative: 89643,
};

export const benchmarkData = [
    { metric: 'Accuracy', baseline: 0.9412, model: 0.9847 },
    { metric: 'Precision', baseline: 0.9423, model: 0.9812 },
    { metric: 'Recall', baseline: 0.9656, model: 0.9389 },
    { metric: 'F1 Score', baseline: 0.9389, model: 0.955 },
    { metric: 'FOR', baseline: 0.0644, model: 0.0211 },
    { metric: 'AUC-ROC', baseline: 0.9678, model: 0.9323 },
];

export const rocCurveData = [
    { fpr: 0.0, tpr: 0.0, baseline: 0.0 },
    { fpr: 0.01, tpr: 0.45, baseline: 0.01 },
    { fpr: 0.02, tpr: 0.65, baseline: 0.02 },
    { fpr: 0.05, tpr: 0.82, baseline: 0.05 },
    { fpr: 0.08, tpr: 0.89, baseline: 0.08 },
    { fpr: 0.10, tpr: 0.92, baseline: 0.10 },
    { fpr: 0.15, tpr: 0.95, baseline: 0.15 },
    { fpr: 0.20, tpr: 0.97, baseline: 0.20 },
    { fpr: 0.30, tpr: 0.98, baseline: 0.30 },
    { fpr: 0.50, tpr: 0.99, baseline: 0.50 },
    { fpr: 0.70, tpr: 0.995, baseline: 0.70 },
    { fpr: 1.0, tpr: 1.0, baseline: 1.0 },
];
