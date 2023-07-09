import { create } from 'zustand'

interface Cell {
    key: string;
    content: string;
}
interface RenRows {
    cells: Cell[];
    key: string;
    onClick: () => void;
}
interface Rows {
    cells: Cell[];
    key: string;
}

type ClickFunction1 = (key: string) => void;
type Storage = {
    fieldindex: number;
    inputValue1: string;
    inputValue2: string;
    inputValue3: string;
    renderedRows: RenRows[];
    setFieldindex:(_arg: number) => void;
    setInputValue1:(_arg: string) => void;
    setInputValue2:(_arg: string) => void;
    setInputValue3:(_arg: string) => void;
    setRows:(_arg: RenRows[]) => void;
};
 
export const useStorage1 = create<Storage>((set,get) => ({
    fieldindex: -1,
    inputValue1: "",
    inputValue2: "",
    inputValue3: "",
    renderedRows: [{cells:[
            {key:"11", content:"nothing"},
            {key:"12", content:"nothing"}],
        key:"1",
        onClick:()=>(console.log(1)) 
    }],
    setFieldindex:(newIndex)=> set(()=>({fieldindex:newIndex})),
    setInputValue1:(newValue)=> set(()=>({inputValue1:newValue})),
    setInputValue2:(newValue)=> set(()=>({inputValue2:newValue})),
    setInputValue3:(newValue)=> set(()=>({inputValue3:newValue})),
    setRows:(newRows)=> set(()=>({renderedRows:newRows}))
}))

export const head = {
    cells: [
        {key:"h1", content:"Field"},
        {key:"h2", content:"Content"}
    ]};

export function GenerateRows(fields:object){
    const rows:Rows[] = [];
    console.log(rows);
    for (let index = 0; index < Object.keys(fields).length; index++) {
        rows.push({
            cells: [
                {key:"key", content:`${Object.keys(fields)[index]}`},
                {key:"value", content:`${Object.values(fields)[index]}`}],
            key:`${index}`
        })
    }    
    console.log(rows);
    return rows;
}

export function RenderRows(rows:Rows[],ClickFunc:ClickFunction1):RenRows[] {
    return rows.map((row) => ({
      ...row,
      onClick: () => (ClickFunc(row.key))
    }));
  }

export function ExtractRows(renderedRows: RenRows[]): Rows[] {
    return renderedRows.map(({ cells, key }) => ({ cells, key }));
}