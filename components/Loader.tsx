/* eslint-disable @next/next/no-img-element */

function Loader({ size }: { size: number }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img
        src="/images/Logo.svg"
        alt="spark ibc logo spinner"
        width={size}
        height={size}
        className="mx-auto mb-1 animate-spin"
      />
    </div>
  );
}

export default Loader;
