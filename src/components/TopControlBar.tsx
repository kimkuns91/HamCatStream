import { IoIosArrowRoundBack } from "react-icons/io";

interface TopControlBarProps {
  showControls: boolean;
  onBack: () => void;
}

const TopControlBar: React.FC<TopControlBarProps> = ({ showControls, onBack }) => {
  return (
    <div className={`control-bar top-0 px-8 md:px-12 py-8 ${showControls ? "visible-control-bar" : "hidden-control-bar"}`}>
      <button className="text-white flex items-center gap-2 hover:scale-125 transition-transform duration-200" onClick={onBack}>
        <IoIosArrowRoundBack className="text-4xl md:text-7xl font-bold" />
      </button>
    </div>
  );
};

export default TopControlBar;
