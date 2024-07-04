"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "@/utils/Image";
import NavLinks from "@/components/NavBar/NavLinks";
import BottomNavBar from "@/components/NavBar/BottomNavBar";
import Logout from "@/components/Modals/Logout";

type Props = {};
const Navbar = (props: Props) => {
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  const [show, setShow] = useState<boolean>(false);
  const showModal = () => {
      setShow(true);
  }
  const closeModal = () => {
      setShow(false);
  }

  return (
    <>
      <nav className="bg-gray-800 hidden md:block md:px-4 lg:px-12 py-2 shadow-lg fixed top-0 z-10 w-full">
        <div className="lg:container w-full lg:mx-auto flex justify-between items-center">
          <Link href="/home">
            <span className="stocky flex items-center justify-center md:ml-2">
              St <Image src="/logo/stocky-logo.png" alt="logo" width={29} height={29} /> cky
            </span>
          </Link>
          <div className="hidden lg:flex space-x-8 mr-8">
            <NavLinks toggleMenu={toggleMenu} showModal={showModal} />
          </div>
          <button className="hidden md:flex lg:hidden" onClick={toggleMenu}>
            <Image className="mx-4" src="/svg/menu.svg" alt="menu" width={25} height={25} />
          </button>
        </div>
      </nav>
      <nav className={`bg-gray-800 z-20 fixed shadow-2xl top-0 right-0 h-screen w-[40%] p-6 transform ${menu ? 'translate-x-0' : 'translate-x-full'} hidden md:block lg:hidden transition-transform duration-300 ease-in-out`}>
        <button className="flex items-center justify-end space-x-4 p-4" onClick={toggleMenu}>
          <Image src="/svg/close.svg" alt="close" width={25} height={25} />
        </button>
        <div className="container mx-auto p-4 flex flex-col h-full justify-start space-y-4 mt-12">
          <NavLinks toggleMenu={toggleMenu} showModal={showModal} />
        </div >
      </nav >
      <BottomNavBar />
      <Logout show={show} closeModal={closeModal} />
    </>
  );
};

export default Navbar
