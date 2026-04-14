export default function Grid() {
    return (
        <div className="absolute inset-0 border-8 border-green-800" >
            <div className="absolute -top-2 -left-2 border border-green-800 w-100 h-62.5 flex items-center justify-center">
                <span className="text-green-800">Possible cam 1</span>
            </div>

            <div className="absolute -top-2 -right-2 border border-green-800 w-100 h-62.5 flex items-center justify-center">
                <span className="text-green-800">Possible cam 2</span>
            </div>

            <div className="absolute -bottom-2 -left-2 border border-green-800 w-100 h-62.5 flex items-center justify-center">
                <span className="text-green-800">Possible cam 3</span>
            </div>


            <div className="absolute -bottom-2 -right-2 border border-green-800 w-100 h-62.5 flex items-center justify-center">
                <span className="text-green-800">Possible cam 4</span>
            </div>
        </div>
    );
}