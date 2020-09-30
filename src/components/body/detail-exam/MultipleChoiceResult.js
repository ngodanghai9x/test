import React from 'react';
import { connect } from 'react-redux';
import * as CommonIcon from 'components/icons/common';
import {
  getResultExam,
  getDetailExam,
} from 'actions/examActions';

import { getMinute } from 'actions/common/utils';

import MainContent from '../layout/MainContent';
import './styles/MultipleChoiceResult.scss';
import { Redirect, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import RankList from './RankList';

class MultipleChoiceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params; // type, môn học
    this.fetchDetailExam(id);
    this.props.getResultExam(id);
  }

  fetchDetailExam = (_id) => {
    this.props.getDetailExam(_id, false).then(({ data, code, message }) => {
      if (data && code === 200) {
        const { id, name, image, subject, grade, description, time, canDelete, examQuestions } = data.exam;
        this.setState({ id, name, image, subject, grade, description, time: time * 60, canDelete, examQuestions });
      }
      if (code === 400) {
      }
    })
  }

  renderResult = (result, location) => {
    return (
      <React.Fragment>
        <div className="exam-result-panel">
          <div className="emoji-result">
            {/* sửa lại đường dẫn chỗ này bằng icon1.jpg trong thư mục images */}
            <img src="https://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg" id="exam-images"></img>
          </div>
          <div className="row-infor-panel">
            <div className="exam-label">Tổng điểm</div>
            <div className="exam-result">
              {`${parseFloat((result.numCorrectAns / result.totalQuestion) * 10).toFixed(2)}/10 Điểm`}
            </div>
          </div>
          {/* <div className="row-infor-panel">
                  <div className="exam-label">Điểm cao nhất</div>
                  <div className="exam-result">0.0/10 Điểm</div>
                </div> */}
          <div className="row-infor-panel">
            <div className="exam-label">Số câu đúng</div>
            <div className="exam-result">
              {`${result.numCorrectAns}/${result.totalQuestion}`}
            </div>
          </div>
          <div className="row-infor-panel">
            <div className="exam-label">Số câu đã làm</div>
            <div className="exam-result">
              {`${result.numAnswer}/${result.totalQuestion}`}
            </div>
          </div>
          <div className="row-infor-panel">
            <div className="exam-label">Thời gian làm bài</div>
            <div className="exam-result">
              {getMinute(result.time)}
            </div>
          </div>
          {/* <div className="row-infor-panel">
                  <div className="exam-label">Ngày Thi</div>
                  <div className="exam-result">
                    {result.date}
                  </div>
                </div> */}
        </div>
        {/* <div className="col-8"> */}
          <div className="row-infor-panel d-flex justify-content-center" style={{border: 'none'}}>
            <div className="item-left">
              <Link to={`${location.pathname}/chi-tiet`}>
                <button className="btn btn-info">xem lại kết quả</button>
              </Link>
            </div>
            <div className="item-right">
              <Link to={`${location.pathname.replace('/ket-qua/', '/')}`}>
                <button className="btn btn-info">làm lại</button>
              </Link>
            </div>
          </div>
        {/* </div> */}
      </React.Fragment>
    );
  }

  render() {// cái kết quả mới là trang này
    const { accessToken, result, location, match, exam } = this.props;
    const { id } = match.params; // type, môn học
    const { name, image, subject, grade, description, time, canDelete, examQuestions } = this.state;
    // if (!accessToken) return <Redirect to='/' />
    return (
      <MainContent>
        <div className='MultipleChoiceResult container'>
          <div className="row">
            <div className="col-8">

              <div className="exam-infor-panel" >
                <div className="Mul-title" >{name} </div>
                <div className="description">
                  {description}
                </div>
                <div className="item-infor-panel">
                  <div className="item-label">
                    <div className="icon">
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" > Số câu hỏi </div>
                  </div>
                  <div className="gwt-HTML" >
                    {`${examQuestions ? examQuestions.length : 0} Câu`}
                  </div>
                </div>
                <div className="item-infor-panel" >
                  <div className="item-label" >
                    <div className="icon" >
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" > Thời gian làm bài </div>
                  </div>
                  <div className="gwt-HTML" >
                    {`${time} Phút`}
                  </div>
                </div>
                {/* <div className="item-infor-panel" >
                  <div className="item-label" >
                    <div className="icon" >
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" >Số lần tạm dừng</div>
                  </div>
                  <div className="gwt-HTML" >0 / Không</div>
                </div> 
                <div className="item-infor-panel" >
                  <div className="item-label" >
                    <div className="icon" >
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" >  </div>
                  </div>
                  <div className="gwt-HTML" >0 / Không giới hạn</div>
                </div>
                <div className="item-infor-panel" >
                  <div className="item-label" >
                    <div className="icon" >
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" > Số người đã tham gia </div>
                  </div>
                  <div className="gwt-HTML" > 1331 </div>
                </div> */}
                {Object.keys(result).length > 0 ? null : (
                  <div className="button" >
                    <Link to={`${location.pathname.replace('/ket-qua/', '/')}`}>
                      <button className="btn btn-info" >Làm bài </button>
                    </Link>
                  </div>
                )}
              </div>
              {Object.keys(result).length > 0 && this.renderResult(result, location)}
            </div>
            <div className="col-4">
              <RankList />
            </div>
          </div>

        </div>
      </MainContent>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  const { auth, exam: { result } } = state;
  return {
    user: auth.user,
    accessToken: auth.accessToken,
    result,
    exam:  result && result.exam || {},
  };
};

export default withRouter(connect(
  mapStateToProps,
  {
    getResultExam,
    getDetailExam,
  }
)(MultipleChoiceResult));
