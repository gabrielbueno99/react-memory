import React from 'react';
import * as C from './App.styles';
import Logo from './assets/devmemory.png';
import RestartIcon from './svgs/restart.svg'
import { Button } from './components/Button';
import {InfoItem} from './components/InfoItem';
import { useEffect } from 'react';
import { useState } from 'react';
import { GridItemType } from './types/GridItemType';
import { GridItem } from './components/GridItem';
import {items} from './data/items'
import { formatTimerElapsed } from './helpers/formatTimerElapsed';


const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  useEffect(()=> resetAndCreateGrid(), []);

  useEffect(()=> {
    const timer = setInterval(()=> {
      if(playing) setTimeElapsed(timeElapsed+1);
    }, 1000);
    return ()=> clearInterval(timer);
  },[playing, timeElapsed]);

  //verifica se os itens abertos sao iguais
  useEffect(()=> {
    if(shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2 ) {
        //se forem iguais transforme a prop permanentShown em true
        //e altera o shown de ambos para false

        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          //seta a copia do {gridItems} para renderizar 
        setGridItems(tmpGrid);
        //zera o count para que o usuario possa realizar as novas verificacoes do jogo
        setShownCount(0);
        } else {
          setTimeout(()=> {
            let tmpGrid = [...gridItems];
          //se nao sao iguais, fecha todos os "shown" com o false
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
          //seta a copia do {gridItems} para renderizar 
            setGridItems(tmpGrid);
            //zera o count para que o usuario possa realizar as novas verificacoes do jogo
            setShownCount(0);
          }, 1000);
          };
        //contabiliza o numero de movimentos realizados pelo usuario a cada verificacao das dos itens
        setMoveCount(moveCount => moveCount + 1)
      }
    }

  }, [shownCount, gridItems]);


  //verifica se o jogo acabou
  useEffect(()=> {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);

  const resetAndCreateGrid = () => {
    //step 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);
    //step 2 - criar o grid
    //step 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [] ;
    for(let i = 0; i < (items.length * 2); i++) {tmpGrid.push({item: null, shown: false, permanentShown: false});}
    //step 2.2 - preencher o grid
    for (let w = 0; w < 2; w++){
      for(let i = 0; i < items.length; i++) {
        let pos = -1
        //verifica se o item esta preenchido ou nao
        while(pos < 0 || tmpGrid[pos].item !== null) {
          //se nao estiver preenchido, gera uma posição randomica em {pos} que vai de 0 a 12 {items.lenght*2}
          pos = Math.floor(Math.random()*(items.length * 2));
        }
        //pega i index {i} e joga dentro da posição em {tmpGrid[pos]}
        tmpGrid[pos].item = i;
      }
    }
    //step 2.3 - jogar no state
    setGridItems(tmpGrid);

    //step 3 - comecar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      
      if(!tmpGrid[index].permanentShown && !tmpGrid[index].shown) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount+1);
      }

      setGridItems(tmpGrid);
    }

  }

  return (
    <C.Container>
        <C.Info>
          <C.LogoLink>
            <img src={Logo} alt="" />
          </C.LogoLink>

          <C.InfoArea>
            <InfoItem label='Tempo' value={formatTimerElapsed(timeElapsed)}></InfoItem>
            <InfoItem label='Movimentos' value={moveCount.toString()}></InfoItem>
          </C.InfoArea>
          <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid}></Button>
        </C.Info>
        <C.GridArea>
          <C.Grid>
            {gridItems.map((item, i)=>(
              <GridItem key={i} item={item} onClick={()=> handleItemClick(i)}></GridItem>
            ))}
          </C.Grid>
        </C.GridArea>
    
    </C.Container>

  
  )

}

export default App;