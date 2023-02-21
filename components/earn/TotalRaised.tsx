type TotalRaisedProps = {
  total: Number;
};

const TotalRaised = ({ total }: TotalRaisedProps) => {
  return (
    <div className="w-full text-center text-xl mt-5">
      <span className="font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-red-bright to-spark-orange">
        {total.toLocaleString()}
      </span>
      &nbsp;USDC Raised
    </div>
  );
};

export default TotalRaised;
