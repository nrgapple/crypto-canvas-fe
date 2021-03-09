import Layout from "../../components/Layout";
import React from "react";
import Link from "next/Link";

const About = () => {
  return (
    <Layout title="About">
      <div className="nav-bar">
        <div className="flex-center-baseline">
          <Link href={"/"}>
            <h5 className="clickable">Crypto Canvas</h5>
          </Link>
          <Link href={"/about"}>
            <h6 className="clickable">about</h6>
          </Link>
          <Link href={"/bids"}>
            <h6 className="clickable">bids</h6>
          </Link>
        </div>
      </div>
      <div className="m8">
        <h1>Create, Buy, and Sell Art on a Global Canvas</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae
          congue eu consequat ac felis donec et. Rhoncus mattis rhoncus urna
          neque. Feugiat in fermentum posuere urna nec tincidunt praesent.
          Venenatis tellus in metus vulputate eu. Porttitor eget dolor morbi non
          arcu risus quis. Pellentesque elit ullamcorper dignissim cras
          tincidunt lobortis. Purus non enim praesent elementum facilisis leo.
          Faucibus nisl tincidunt eget nullam. Nulla aliquet porttitor lacus
          luctus accumsan tortor posuere ac. Tempor nec feugiat nisl pretium
          fusce id velit ut. Eget mauris pharetra et ultrices neque ornare. Enim
          sed faucibus turpis in eu mi. Et leo duis ut diam quam. Sem nulla
          pharetra diam sit amet nisl suscipit adipiscing bibendum. Est sit amet
          facilisis magna etiam tempor orci. Non pulvinar neque laoreet
          suspendisse. Dignissim enim sit amet venenatis. Nunc sed id semper
          risus in hendrerit gravida rutrum. Commodo elit at imperdiet dui
          accumsan. Pellentesque pulvinar pellentesque habitant morbi tristique
          senectus. Morbi tristique senectus et netus et malesuada fames ac
          turpis. Aliquam eleifend mi in nulla posuere sollicitudin aliquam
          ultrices. Adipiscing bibendum est ultricies integer quis auctor elit
          sed. Sed augue lacus viverra vitae congue eu. Porttitor lacus luctus
          accumsan tortor posuere ac ut. Odio pellentesque diam volutpat commodo
          sed egestas egestas fringilla phasellus. Vel quam elementum pulvinar
          etiam non quam. Urna condimentum mattis pellentesque id nibh tortor
          id.
        </p>
      </div>
    </Layout>
  );
};

export default About;
