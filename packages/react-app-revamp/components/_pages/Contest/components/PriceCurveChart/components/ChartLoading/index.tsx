import MotionSpinner from "@components/UI/MotionSpinner";

const PriceCurveChartLoading = () => {
  return (
    <div style={{ marginTop: "60px", marginBottom: "60px" }}>
      <MotionSpinner size={40} />
    </div>
  );
};

export default PriceCurveChartLoading;
