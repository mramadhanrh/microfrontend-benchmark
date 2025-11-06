interface TaskCheckboxProps {
  checked?: boolean;
  onChange: () => void;
}

const TaskCheckbox = ({ checked = false, onChange }: TaskCheckboxProps) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="mt-1 w-5 h-5 rounded border-[#858585] text-[#E8232C] focus:ring-[#E8232C] focus:ring-offset-2 cursor-pointer transition-all duration-200 hover:scale-110 bg-transparent checked:bg-[#E8232C] checked:border-[#E8232C]"
  />
);

export default TaskCheckbox;
