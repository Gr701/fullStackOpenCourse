import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({name, count}) => <tr><td>{name}</td><td>{count}</td></tr>

const Statistics = ({state}) => {
 const {good, neutral, bad, sum, all} = state
  if (all === 0) {
    return (
      <>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </>
    )
  }
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine  name='good' count={good}/>
          <StatisticLine  name='neutral' count={neutral}/>
          <StatisticLine  name='bad' count={bad}/>
          <StatisticLine  name='all' count={all}/>
          <StatisticLine  name='average' count={sum/all}/>
          <StatisticLine  name='positive' count={good * 100 / all + ' %'}/> 
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [state, setState] = useState({
    good: 0,
    neutral: 0, 
    bad: 0,
    sum: 0,
    all: 0
  })

  const onGood = () => {
    setState({...state,
      good: state.good + 1,
      sum: state.sum + 1,
      all: state.all + 1
    })
  }

  const onNeutral = () => {
    setState({...state,
      neutral: state.neutral + 1,
      all: state.all + 1
    })
  }
  
  const onBad = () => {
    setState({...state,
      bad: state.bad + 1,
      sum: state.sum - 1,
      all: state.all + 1
    })
  }

  return (
    <>
      <h1>give feedback</h1>
      <Button onClick={onGood} text='good'/>
      <Button onClick={onNeutral} text='neutral'/>
      <Button onClick={onBad} text='bad'/>
      <Statistics state={state}/>
    </>
  )
}

export default App
