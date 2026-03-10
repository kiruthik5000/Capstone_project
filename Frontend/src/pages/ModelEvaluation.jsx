import Header from '../components/Header';
import ModelMetrics from '../components/ModelMetrics';
import BenchmarkTable from '../components/BenchmarkTable';

export default function ModelEvaluation() {
  return (
    <div>
      <Header systemStatus="normal" activeAlerts={0} />
      <ModelMetrics />
      <BenchmarkTable />
    </div>
  );
}
