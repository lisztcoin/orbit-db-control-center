import React from 'react'
import { 
  majorScale,
  minorScale,
  Button,
  Heading,
  Pane,
  Spinner,
  Text
} from 'evergreen-ui'

function Questions () {

    return (
        <>
        <Pane marginX={majorScale(6)}>
          <Heading
            fontFamily='Titillium Web'
            color='#425A70'
            size={700}
            textTransform='uppercase'
            marginTop={majorScale(3)}
            marginBottom={majorScale(2)}
          >
            Report Daily Carbon Activities
          </Heading>
        </Pane>
        <Pane 
          display='flex' 
          flexDirection='row'
          marginX={majorScale(6)}
          marginTop={majorScale(2)}
          marginBottom={majorScale(1)}
        >
          <Button
            iconBefore='document'
            appearance='default'
            height={24}
            onClick={handleCreateDatabase}
          >
            Create
          </Button>
          <Button
            iconBefore='plus'
            appearance='default'
            height={24}
            marginLeft={minorScale(1)}
            onClick={handleAddDatabase}
          >
            Open
          </Button>
        </Pane>
        <Pane display='flex' justifyContent='center' overflow='auto'>
          <CreateDialog onCreate={createDB}/>
          <AddDialog onAdd={addDB}/>
          <Pane
            flex='1'
            overflow='auto'
            elevation={1}
            background='white'
            marginX={majorScale(6)}
          >
            {!appState.loading.programs 
              ? (<ProgramList
                  programs={appState.programs}
                  onRemove={handleRemoveDatabase}
                />)
              : (<Pane
                  display='flex' 
                  flexDirection='column' 
                  alignItems='center' 
                  marginTop={majorScale(3)}
                  marginBottom={majorScale(1)}
                >
                  <Spinner size={24}/>
                  <Text marginY={majorScale(1)}>Loading...</Text>
                </Pane>)
            }
          </Pane>
        </Pane>
        </>
      )
}

export default Questions