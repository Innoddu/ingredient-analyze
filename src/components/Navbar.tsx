export default function Navbar() {


  return (
      <div className="w-full max-w-none mb-0 pt-5 pb-5 mx-auto bg-white relative px-5 py-[15px] text-black text-[20px] leading-[1.5em]">
        <div className="w-full max-w-none mx-auto">
          <div className="flex justify-between items-center relative md:flex items-center">
            <a href="/" className="text-xl/5 text-black font-jost block">Eat Cook Joy</a>
            
            <nav className="float-right relative">
              <ul className="flex space-x-8 justify-between items-center mb-0 pl-0 list-none">
                <li><a href="#about" className="">About</a></li>
                <li><a href="#chef" className="">Chef</a></li>
                <li><a href="#dishes" className="">Dishes</a></li>
                <li><a href="#services" className="">Services</a></li>
                <li><a href="#faqs" className="">FAQs</a></li>
                <li><a href="#login" className="">Login</a></li>
                <li><a href="#assistant" className="">Assistant</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
  );
}
