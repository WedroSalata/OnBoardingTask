import React, { useEffect,ReactNode, useState, useCallback } from 'react';
import { invoke, requestJira } from '@forge/bridge';
import Button, {ButtonGroup} from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import Textfield from '@atlaskit/textfield';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';
import Error from '@atlaskit/icon/glyph/Error';
import Flag, { FlagGroup } from '@atlaskit/flag';
import {head,GenerateRows,RenderRows,ExtractRows,useStorage1} from './storage.tsx';
import './styles.css'


function App() {

    const [fieldindex, inputValue1,inputValue2,inputValue3,renderedRows] = useStorage1((state) => [
        state.fieldindex,
        state.inputValue1,
        state.inputValue2,
        state.inputValue3, 
        state.renderedRows
    ]);
    const [setFieldindex, setInputValue1,setInputValue2,setInputValue3,setRows] = useStorage1((state) => [
        state.setFieldindex,
        state.setInputValue1,
        state.setInputValue2,
        state.setInputValue3,  
        state.setRows
    ]);

    useEffect (()=>{
        
        if(fieldindex > -1 && renderedRows[fieldindex] != undefined){
            setInputValue2(renderedRows[fieldindex].cells[1].content);
            console.log(inputValue2);
        }

    },[fieldindex])


  
    function fieldIndUpd(i:string) {
        console.log(i);
        setFieldindex(Number(i));
    }
    
    function UpdateField(value:string, index:number) {
        renderedRows[index].cells[1].content = value;
    }

    async function getUpdate(id:string) {
        if(id == ""){
            console.log("Wrong input");
            return;
        }

        const payload = {key: `${id}`} 
        let temp = await invoke('getPublicStorage',payload).then((data1:any) => (temp = data1))
        if (temp.length > 0) {
            setRows(RenderRows(temp,(i:string) => (fieldIndUpd(i))))
            console.log("Readed from storage");
            console.log(payload.key);
        }
        else{
            console.log("Wrong input");
        }
    }

    async function AiTesting() {
        await invoke('generateSummary').then(reply => {
            console.log('Assistant:', reply);
          })
    }


    function Remove (id:string) {
        const pld = { key: id}
        invoke('removePublicStorage',pld);
        console.log("Removed");
    }

    // eslint-disable-next-line
    function setUpdate(id:string) {
        if (renderedRows.length > 1)
        {   
            const payload = {key: `${id}`, data: ExtractRows(renderedRows)}
            invoke('setPublicStorage',payload);
            console.log("Added to storage");
            console.log(payload.key);
        }
        else console.log("Wrong input");
    }

    async function Search(id:string) {
        console.log("Searching");
        const ans = await (await requestJira(`/rest/api/2/issue/${id}`)).json();         // ans.fields:Array
        if (ans.fields != null) {
            setRows(RenderRows(GenerateRows(ans.fields),(i:string) => (fieldIndUpd(i))));
            console.log(renderedRows); 
        }
        else {
            console.log("Wrong ID");
        }
    }  

    type flagData = {
        created: number;
        description: string;
        id: number;
        key: number;
        icon: ReactNode;
        title: string;
    };

    const getFlagData = (index: number):ReactNode=> {
        return <Flag 
            description= "errorcode"
            icon = {<Error label="Error"/>}
            id= {index}
            key= {index}
            title= ": Whoa a new flag!"
        /> 
    };

    const [flags, setFlags] = useState<Array<number>>([]);

    const addFlag = () => {
      const newFlagId = flags.length + 1;
      const newFlags = flags.slice();
      newFlags.splice(0, 0, newFlagId);
  
      setFlags(newFlags);
    };
  
    const handleDismiss = () => {
      setFlags(flags.slice(1));
    };
  

    return (<>
        <div >
            <Form onSubmit={(data) => {
                console.log('form data', data)
            }}>

            {({ formProps }) => (
                <form {...formProps}>

                <div className='body'>
                    <div className="class2">
                        <DynamicTable
                            head={head}
                            rows={renderedRows}
                            rowsPerPage={15}
                            loadingSpinnerSize="large"
                        />
                    </div>

                    <div className='class1'>

                        <div className='panel2'>           
                            <Field label="Issue searching" name="example-text">
                            {({ fieldProps }: any) => (
                                <Textfield
                                name = "SearchInput"
                                appearance="standard"
                                placeholder="10011"
                                value={inputValue1}
                                pattern="\d{4,10}"
                                maxLength={10}
                                onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                                setInputValue1(e.target.value)}}
                                />
                            )}
                            </Field>
                            <Button appearance="primary" onClick = {()=>Search(inputValue1)}>Search</Button>
                       </div>
                        
                        <div className='panel2'>       
                            <Field label="Issue saving" name="example-text">
                                {({ fieldProps }: any) => (
                                    <Textfield
                                    appearance="standard"
                                    label = "EditingField"
                                    placeholder="Edited field"
                                    value={inputValue2}
                                    maxLength={10}
                                    pattern='\d{4,10}'
                                    onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInputValue2(e.target.value)}}
                                />
                            )}
                            </Field>
                        
                            <ButtonGroup>
                                <Button onClick = {()=>getUpdate(inputValue2)}>Get info</Button>
                                <Button onClick = {()=>setUpdate(inputValue2)}>Set info</Button>
                                <Button appearance="danger" onClick = {()=>Remove(inputValue2)}>Remove info</Button>
                            </ButtonGroup>

                        </div>

                        <div className='panel2'>
                            <Field label="Issue editing" name="example-text">
                                {({ fieldProps }: any) => (
                                <Textfield
                                    appearance="standard"
                                    label = "EditingField"
                                    placeholder="Edited field"
                                    value={inputValue3}
                                    onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInputValue3(e.target.value)}}
                                />)}
                            </Field>
                            <Button onClick = {()=>UpdateField(inputValue3,fieldindex)}>Apply</Button>
                            
                        </div>

                        <div>
                            <Button onClick = {()=>AiTesting()}>AiTesting</Button>
                            <Button onClick = {()=>addFlag()}>Flag</Button>                             
                        </div>
                    </div>

                </div>

                </form>)}
            </Form>
            
            <FlagGroup onDismissed={handleDismiss}>
                {flags.map((flagId) => {
                return (
                    <Flag
                    id={flagId}
                    icon={<Error label="Error"/>}
                    key={flagId}
                    title={`Flag #${flagId}`}
                    description="I will auto dismiss after 8 seconds"/>
                );
                })}
            </FlagGroup>
           
        </div>


    </>);
}

export default App;


