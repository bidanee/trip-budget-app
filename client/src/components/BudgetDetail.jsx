import { useParams, Link } from "react-router-dom";

const BudgetDetail = () => {
  const { id } = useParams()

  return (
    <div>
      <h2>예산 상세 페이지</h2>
      <p>현재 보고 있는 예산 계획의 ID : {id}</p>
      {/* todo : 지출 내역 추가 및 관리 기능 */}
      <br/>
      <Link to="/">대시보드 가기</Link>
    </div>
  )
}

export default BudgetDetail