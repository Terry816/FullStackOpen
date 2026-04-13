const StatisticLine = ({ text, count, notation }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{count} {notation}</td>
    </tr>
  )
}

export default StatisticLine