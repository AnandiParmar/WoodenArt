import LoadingAnimation from "../LoadingAnimation";

export default function LoadingAnimationExample() {
  return <LoadingAnimation onComplete={() => console.log("Animation complete")} />;
}
