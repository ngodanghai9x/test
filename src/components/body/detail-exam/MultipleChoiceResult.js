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
import { getScore } from 'actions/common/getInfo';
import Comment from "./Comment";

class MultipleChoiceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listQ: [],
      numPeopleDid: 0,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params; // type, môn học
    this.fetchDetailExam(id);
    this.props.getResultExam(id);
  }

  fetchDetailExam = (_id) => {
    console.log("MultipleChoiceResult -> fetchDetailExam -> _id", _id)
    this.props.getDetailExam(_id, false).then(({ data, code, message }) => {
      if (data && code === 200) {
        const { id, name, image, subject, grade, description, time, canDelete, examQuestions, numPeopleDid, numRework } = data.exam;
        this.setState({ id, name, image, subject, grade, description, time, canDelete, listQ: examQuestions || [], numPeopleDid, numRework });
      }
      if (code === 400) {
      }
    })
  }

  renderResult = (result, location) => {
    return (
      <React.Fragment>
        <div className="exam-result-panel">
          <div className="emoji-result d-flex justify-content-center">
            {/* <img src="https://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg" id="exam-images"></img> */}
            {/* <img src={`${process.env.PUBLIC_URL}/images/icon1.jpg`} alt='subject' /> */}
            <div className="score">
              {getScore((result.numCorrectAns / result.totalQuestion) * 10).score}
            </div>
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
            <div className="exam-label">Thời gian đã làm</div>
            <div className="exam-result">
              {getMinute(result.doTime)}
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
        <div className="row-infor-panel d-flex justify-content-center" style={{ border: 'none' }}>
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
    const { accessToken, result, location, match, exam, isDone } = this.props;
    const { id } = match.params; // type, môn học
    const { name, image, subject, grade, description, time, listQ, numPeopleDid, numRework } = this.state;
    const {
      examName,
      examDescription,
      numAnswer,
      numCorrectAns,
      doTime,
      totalTime,
      totalQuestion,
      examQuestions,
    } = result;
    // if (!accessToken && isDone) return <Redirect to='/' />
    if (match.params.subject === 'van') {
      if (location.pathname.includes('lop-10')) {
        return <Redirect to={`/lop-10/mon/van/${id}`} />
      }
      return <Redirect to={`/dai-hoc/mon/van/${id}`} />
    }
    return (
      <MainContent>
        <div className='MultipleChoiceResult container'>
          <div className="row">
            <div className="col-8">

              <div className="exam-infor-panel" >
                <div className="Mul-title" >{examName || name} </div>
                <div className="description">
                  {examDescription || description}
                </div>

                <div className="item-infor-panel">
                  <div className="item-label">
                    <div className="icon">
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" > Số câu hỏi </div>
                  </div>
                  <div className="gwt-HTML" >
                    {`${totalQuestion ? totalQuestion : listQ.length} Câu`}
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
                    {`${totalTime || (time || 0)} phút`}
                  </div>
                </div>

                <div className="item-infor-panel" >
                  <div className="item-label" >
                    <div className="icon" >
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" >Số lần làm lại</div>
                  </div>
                  <div className="gwt-HTML" >
                    {`${numRework || 0} / Không giới hạn`}
                  </div>
                </div>

                <div className="item-infor-panel" >
                  <div className="item-label" >
                    <div className="icon" >
                      <i className="far fa-calendar-alt" />
                    </div>
                    <div className="label" > Số người đã tham gia </div>
                  </div>
                  <div className="gwt-HTML" >
                    {`${numPeopleDid} người`}
                  </div>
                </div>

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

          <div className="row">
            <div className="col-8">
              {/*Ông truyền examId vào username vào component kia hộ t nhé*/}
              <Comment />
            </div>
            <div className="col-4">

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
    result: result || {},
    exam: result && result.exam || {},
    isDone: auth.isDone,
  };
};

export default withRouter(connect(
  mapStateToProps,
  {
    getResultExam,
    getDetailExam,
  }
)(MultipleChoiceResult));
