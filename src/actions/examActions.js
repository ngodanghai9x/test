import { actionTypes } from "constants/actionTypes";
import callApi from "./common/callApi";
import { getObjSubject, getObjLevel } from "./common/getInfo";

export const callApiExam = (kind = '') => (dispatch) => {
  dispatch({
    type: actionTypes.CALL_API_EXAM,
    kind,
  });
}

export const changeActivePage = (activePage) => (dispatch) =>{
  dispatch({
    type: actionTypes.CHANGE_ACTIVE_PAGE,
    activePage,
  });
}

export const getExamBySubject = (subject, grade) => (dispatch, getState) => {
  const obj = getObjSubject(subject);
  const ob = getObjLevel(grade);
  const req = {
    body: {
      subject: obj.en,
      grade: ob.en,
    }
  };
  return callApi('exam-by-subject', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch({
          type: actionTypes.GET_EXAM_BY_SUBJECT,
          subject: obj.eng,
          grade: ob.en,
          exams: data.exam,
        })
        dispatch(changeSubject(ob.num, obj.en))
        // window.noti.success('Đăng nhập thành công');
      }
      if (code === 400) {
        // window.noti.error('Tài khoản hoặc mật khẩu (mã OTP) không đúng');
      }
    })
    .catch(err => {
    });
};

export const getDetailExam = (id, isAdmin) => (dispatch, getState) => {
  // const url = isAdmin ? 'api/exam/get' : 'api/profile/get-exam';get-exam
  const url = isAdmin ? 'api/exam/get' : 'get-exam';
  const req = {
    body: {
      id,
    }
  };
  return callApi(url, { method: 'POST', data: req })
  // .then(({ data, code, message }) => {
  //   if (data && code === 200) {
  //     dispatch({
  //       type: actionTypes.GET_DETAIL_EXAM,
  //       exam: data.exam,
  //     })
  //     // window.noti.success('Đăng nhập thành công');
  //   }
  //   if (code === 400) {
  //     // window.noti.error('Tài khoản hoặc mật khẩu (mã OTP) không đúng');
  //   }
  // })
  // .catch(err => {
  // });
};

export const changeSubject = (grade, subject) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.CHANGE_SUBJECT,
    grade,
    subject,
  })
};

export const changeHeader = (header) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.CHANGE_HEADER,
    header,
  })
};

export const createExam = (name, image, subject, grade, description, time, examQuestions, code) => (dispatch, getState) => {
  const obj = getObjSubject(subject);
  const ob = getObjLevel(grade);
  const req = {
    body: {
      exam: {
        name,
        code,
        subject: obj.en,
        grade: ob.en,
        mixedQuestion: true,
        description,
        time,
        examQuestions,
        numQuestion: examQuestions.length,
      }
    }
  };
  return callApi('api/exam/add', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch({
          type: actionTypes.CREATE_EXAM,
          exam: data.exam,
          subject: obj.eng,
          grade,
        });
        window.noti.success('Thêm mới đề thành công');
        dispatch(callApiExam());
      }
      if (code === 400) {
        window.noti.error('Thêm mới đề thất bại');
        dispatch(callApiExam());
      }
    })
    .catch(err => {
      dispatch(callApiExam());
    });
};

export const updateExam = (examInfo, examQuestions) => (dispatch, getState) => {
  const obj = getObjSubject(examInfo.subject);
  const ob = getObjLevel(examInfo.grade);
  const req = {
    body: {
      exam: {
        ...examInfo,
        // image,
        subject: obj.en,
        grade: ob.en,
        mixedQuestion: true,
        examQuestions,
        numQuestion: examQuestions.length,
      }
    }
  };
  return callApi('api/exam/update', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        // dispatch(getAllExam());
        // dispatch({
          //   type: actionTypes.UPDATE_EXAM,
          //   exam: data.exam,
          //   subject: obj.eng,
          //   grade,
          //   id,
          // });
          window.noti.success('Cập nhật đề thành công');
          dispatch(callApiExam());
        }
      if (code === 400) {
        window.noti.error('Cập nhật đề thất bại');
        dispatch(callApiExam());
      }
    })
    .catch(err => {
      dispatch(callApiExam());
    });
};

export const changeActiveExam = (id, isActive) => (dispatch, getState) => {
  const req = {
    body: {
      id,
      isActive: !isActive,
    }
  };
  return callApi('api/exam/change-active', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch({
          type: actionTypes.CHANGE_ACTIVE_EXAM,
          id,
          isActive,
        });
        window.noti.success('Đổi trạng thái của đề thành công');
      }
      if (code === 400) {
        window.noti.error('Đổi trạng thái của đề thất bại');
      }
    })
    .catch(err => {
    });
};
export const deleteExam = (examIds) => (dispatch, getState) => {
  const req = {
    body: {
      examIds,
    }
  };
  return callApi('api/exam/delete', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch({
          type: actionTypes.DELETE_EXAM,
          examIds,
        })
        window.noti.success('Xóa đề thành công');
      }
      if (code === 400) {
        window.noti.error('Xóa đề thất bại');
      }
    })
    .catch(err => {
    });
};
export const doExam = (id, time, questionAnswer, numOptionPicked) => (dispatch, getState) => {
  const req = {
    body: {
      id, time, questionAnswer, numOptionPicked
    }
  };
  return callApi('api/profile/do-exam', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        // dispatch(getRankList(id));
        window.noti.success('Nộp bài thành công');
        // setTimeout(() => dispatch(receiveResultExam(data.result)), 2500);
      }
      if (code === 400) {
        // dispatch(receiveResultExam({}));
        window.noti.error('Nộp bài thất bại');
      }
    })
    .catch(err => {
    });
};

export const getResultExam = (examId) => (dispatch, getState) => {
  const req = {
    body: {
      examId,
    }
  };
  return callApi('api/get-last-history', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch(receiveResultExam(data.lastHistory));
        // window.noti.success('Nộp bài thành công');
      }
      if (code === 400) {
        // dispatch(receiveResultExam({}));
        // window.noti.error('Nộp bài thất bại');
      }
    })
    .catch(err => {
    });
};

export const getListHistoryExam = (currentPage = 1, pageSize = 10) => (dispatch, getState) => {
  const req = {
    body: {
      pageNumber: currentPage -1,
      pageSize,
    }
  };
  return callApi('api/profile/get-history', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch({
          type: actionTypes.GET_LIST_HISTORY_EXAM,
          content: data.examHistoryDtos.content,
          totalPages: data.examHistoryDtos.totalPages,
          pageSize: data.examHistoryDtos.pageSize,
          currentPage: data.examHistoryDtos.currentPage,
          totalElements: data.examHistoryDtos.totalElements,
          sort: data.examHistoryDtos.sort,
          
        });
        // window.noti.success('Nộp bài thành công');
      }
      if (code === 400) {
        // dispatch(receiveResultExam({}));
        // window.noti.error('Nộp bài thất bại');
      }
    })
    .catch(err => {
    });
};

export const getHistoryExam = (historyId) => (dispatch, getState) => {
  const req = {
    body: {
      historyId
    }
  };
  return callApi('api/profile/get-result', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch(receiveResultExam(data.result));
        // window.noti.success('Nộp bài thành công');
      }
      if (code === 400) {
        // dispatch(receiveResultExam({}));
        // window.noti.error('Nộp bài thất bại');
      }
    })
    .catch(err => {
    });
};

export const getAllExam = (inputSearch = '', pageNumber = 1, pageSize = 10, filter) => (dispatch, getState) => {
  const req = {
    body: {
      pageSize,
      pageNumber: pageNumber -1,
      inputSearch,
      grade: filter ? filter.grade : '',
      subject: filter ? filter.subject : '',
    }
  };
  return callApi('api/exam/get-all', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        // id, name, image, subject, grade, description, time, canDelete, examQuestions
        dispatch({
          type: actionTypes.GET_ALL_EXAM,
          exams: data.examDtos.content,
          pagination: {
            currentPage: data.examDtos.currentPage,
            totalElements: data.examDtos.totalElements,
            totalPages: data.examDtos.totalPages,
            pageSize: data.examDtos.pageSize,
          },
        });

        // window.noti.success('Đăng nhập thành công');
      }
      if (code === 400) {
        // window.noti.error('Tài khoản hoặc mật khẩu (mã OTP) không đúng');
      }
    })
    .catch(err => {
    });
};

export const getRankList = (examId) => (dispatch, getState) => {
  const req = {
    body: {
      examId
    }
  };
  return callApi('ranking-by-exam', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        console.log("getRankList -> data", data)
        dispatch({
          type: actionTypes.GET_RANK_LIST,
          rankList: data.ranking || [],
        })
        // window.noti.success('Đăng nhập thành công');
      }
      if (code === 400) {
        // window.noti.error('Tài khoản hoặc mật khẩu (mã OTP) không đúng');
      }
    })
    .catch(err => {
    });
};

export const getCompletedExams = () => (dispatch, getState) => {
  const req = {
    body: {

    }
  };
  return callApi('api/profile/get-completed-exam', { method: 'POST', data: req })
    .then(({ data, code, message }) => {
      if (data && code === 200) {
        dispatch({
          type: actionTypes.GET_COMPLETED_EXAMS,
          completedExams: data.completedExamDtos,
        })
        // window.noti.success('Đăng nhập thành công');
      }
      if (code === 400) {
        // window.noti.error('Tài khoản hoặc mật khẩu (mã OTP) không đúng');
      }
    })
    .catch(err => {
    });
}
const receiveResultExam = (result) => (dispatch) => {
  //numAnswer, numCorrectAns, time, totalQuestion, examQuestions
  dispatch({
    type: actionTypes.GET_RESULT_EXAM,
    result,
  })
}