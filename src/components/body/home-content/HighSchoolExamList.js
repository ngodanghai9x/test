import React from 'react';
import { connect } from 'react-redux';
import * as CommonIcon from 'components/icons/common';





import Ads from 'components/common/Ads';
import MainContent from 'components/body/layout/MainContent';
import CompletedExam from 'components/common/CompletedExam';

import { getExamBySubject, changeSubject } from 'actions/examActions';
import { getInfo, subjects2, getObjSubject } from 'actions/common/getInfo';

import '../styles/ExamList.scss';
import { Link } from 'react-router-dom';

class HighSchoolExamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { match, location } = this.props;
    const { subject } = match.params; // type, môn học
    this.props.getExamBySubject(subject, 'Đại học');
  }

  renderExam = (exams) => {
    return exams.map(item => {
      return (
        <div className='exam'>
          <div className='name'>
            Đề luyện thi vào lớp 10 môn Tiếng Anh 2020 - Đề số 2
            {item.vn}
          </div>
          <div className='description'>
            Mời các em cùng tham khảo đề luyện thi vào lớp 10 2020 môn Tiếng Anh - Đề số 1 (Có đáp án) được chia sẻ để có thêm tài liệu ôn tập chuẩn bị cho kì thi vào lớp 10 năm 2020 sắp tới. Tài liệu đi kèm có đáp án giúp các em so sánh kết quả bài làm và tự đánh giá được lực học của bản thân, từ đó đặt ra kế hoạch ôn tập phù hợp giúp để đạt kết quả cao trong kì thi.
          </div>
          <div className='time'>
            Thời gian làm đề: 60 phút
          </div>
          <div className='amount'>
            Tổng số câu: 46
          </div>
          <div className='wrapper-button d-flex justify-content-end'>
            <button className='btn btn-info'>
              Vào thi
            </button>
            <div className='text-link'>
              Xem chi tiết >
            </div>
          </div>
        </div>
      );
    })
  }

  getExamBySubject = subject => {
    this.props.changeSubject(10, subject);
    this.props.getExamBySubject(subject, 'Lớp 10');
  }

  render() {
    const { match, location, activeHSSub } = this.props;
    const { subject } = match.params; // type, môn học
    const objSub = getObjSubject(subject);
    return (
      <MainContent>
        <div className='exam-list college'>
          <div className='path-button d-flex'>
            {subjects2.map((item, idx) => {
              if (idx < 3) {
                return (
                  <Link  to={`/dai-hoc/${item.en}`} >
                    <button type="button"
                      className={`btn btn-outline-info btn-link-sub ${activeHSSub === item.en ? 'active' : ''}`}
                      onClick={() => this.getExamBySubject(item.en)}
                    >
                      {item.vn}
                    </button>
                  </Link>
                );
              }
              return null;
            })}

          </div>

          <h2 className='title-center'>
            {`LUYỆN THI VÀO LỚP 10 ${objSub.vn} ONLINE`}
          </h2>

          <div className='main-content row'>
            <div className='col-lg-8 col-md-12'>
              {this.renderExam(subjects2)}
            </div>
            <div className='col-lg-4 col-md-12'>
              <CompletedExam />
              <Ads />
            </div>
          </div>
        </div>
      </MainContent>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  const { exam: { activeHSSub, activeCollegeSub } } = state;

  return {
    activeCollegeSub,
    activeHSSub,
  }
};

export default connect(
  mapStateToProps,
  {
    changeSubject,
    getExamBySubject,
  }
)(HighSchoolExamList);
