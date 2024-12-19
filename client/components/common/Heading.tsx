import React from "react";
interface HeadingProps extends React.HtmlHTMLAttributes<HTMLHeadingElement> {
  title: string;
  desc: string;
}
const Heading = ({ title, desc }: HeadingProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
};

export default Heading;
