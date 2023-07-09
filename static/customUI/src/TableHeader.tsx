
export let rows1 = [{
    cells:[
        {key:"11", content:"nothing"},
        {key:"12", content:"nothing"}
    ],

    key:"1",
    onClick:()=>(console.log(1)) 
}];



export function UpdateRows(fields:object, ClickFunc:any)
    {
    console.log(rows1);
    rows1 = [];
    for (let index = 0; index < Object.keys(fields).length; index++) {

        rows1.push({
            cells: [
                {key:"key", content:`${Object.keys(fields)[index]}`},
                {key:"value", content:`${Object.values(fields)[index]}`}],
            key:`${index}`,
            onClick:() => (ClickFunc(index))
        })
    }    
    console.log(rows1);
    return rows1;
}


export const head = {
    cells: [
        {key:"h1", content:"Field"},
        {key:"h2", content:"Content"}
    ]};

// rows = [{cells:Array<RowCellType>, key: "1", onClick:React.MouseEventHandler},{...}]
// 
// RowCellType = {key:"11", content:"123"}


