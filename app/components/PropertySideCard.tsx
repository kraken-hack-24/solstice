import { MapIcon } from "@heroicons/react/24/outline";

const PropertySideCard = () => {
    return (
        <li>
              <a
                href={''}
                className="bg-gray-800 text-white group flex flex-col gap-y-2 rounded-md p-4 text-sm font-semibold leading-6 hover:bg-gray-700 transition"
              >
                <div className="flex gap-x-3 items-center">
                  <MapIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span>11 Van Ru Street</span>
                </div>
                <div className="flex justify-between flex-1 flex-col mt-2">
                  <span className="text-green-400">Energy Savings: £100</span>
                  <span className="text-gray-400">BT Group</span>
                </div>
              </a>
            </li>
    );
}

export default PropertySideCard;