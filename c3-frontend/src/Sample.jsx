import BlurText from "./components/BlurText";

function Sample() {

  const handleAnimationComplete = () => {
    console.log("Animation Finished!");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111"
      }}
    >
      <BlurText
        text="Welcome to C3!"
        delay={200}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="title"
      />
    </div>
  );
}

export default Sample