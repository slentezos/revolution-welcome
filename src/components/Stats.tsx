import { motion } from "framer-motion";
const stats = [{
  value: "500+",
  label: "Partner Clubs",
  suffix: ""
}, {
  value: "2,500",
  label: "Active Players",
  suffix: "+"
}, {
  value: "€50",
  label: "Transfer Value",
  suffix: "M+"
}, {
  value: "98",
  label: "Success Rate",
  suffix: "%"
}];
const Stats = () => {
  return <section className="py-20 bg-background relative overflow-hidden min-h-[60vh] flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10 w-full">
        
      </div>
    </section>;
};
export default Stats;