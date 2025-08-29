import { Card } from '@/components/ui/card';

export function HabitMenu() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-[#b425aa]">Resilient Habit Designer</h2>
      <p className="mt-2 text-gray-700">
        Build habits that stick — using science, simplicity, and self-awareness.
      </p>
      <button className="mt-4 px-4 py-2 bg-[#b425aa] text-white rounded hover:bg-[#a01e99]">
        Start Designing
      </button>
    </Card>
  );
}

export default HabitMenu;
