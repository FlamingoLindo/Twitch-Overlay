
export default function Simple() {
    return (
        <div className="absolute inset-0 border-8 border-white" >
            <div className="absolute -top-2 -left-2 border border-white w-100 h-62.5 flex items-center justify-center">
                <span className="text-white">Possible cam 1</span>
            </div>

            <div className="absolute -top-2 -right-2 border border-white w-100 h-62.5 flex items-center justify-center">
                <span className="text-white">Possible cam 2</span>
            </div>

            <div className="absolute -bottom-2 -left-2 border border-white w-100 h-62.5 flex items-center justify-center">
                <span className="text-white">Possible cam 3</span>
            </div>


            <div className="absolute -bottom-2 -right-2 border border-white w-100 h-62.5 flex items-center justify-center">
                <span className="text-white">Possible cam 4</span>
            </div>
        </div>
    );
}