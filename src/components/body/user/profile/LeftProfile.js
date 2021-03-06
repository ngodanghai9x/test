import React from 'react';
import { connect } from 'react-redux';
import * as CommonIcon from 'components/icons/common';

// import { browserHistory } from 'react-router'

import { Link, Redirect, withRouter } from 'react-router-dom';
import { hideEmail, hidePhone } from 'actions/common/utils';
import { regex, errorText } from 'constants/regexError';
import { updateUserInfo, callApiUser } from 'actions/userActions';
import DatePicker from "react-datepicker";
import $ from 'jquery';

class LeftProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorName: '',
    };
  }


  componentDidMount() {
    this.resetState();
    $('.react-datepicker__input-container input[type=text]').attr("placeholder", "Chọn ngày sinh nhật");
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.callUser && this.props.callUser === 'LeftProfile') {
      nextProps.history.push('/');
      return;
    }
    if (nextProps.user !== this.props.user) {
      const { name, email, phone, school, gender, birthday } = nextProps.user;
      this.setState({ name, email, phone, school, gender, birthday });
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  resetState = action => {
    const { name, email, phone, school, gender, birthday } = this.props.user;
    this.setState({ name, email, phone, school, gender, birthday, errorName: '', errorPhone: '' });
    if (action === 'cancel') {
      this.props.history.push('/');
    }
  }

  changeGender = (gender) => {
    this.setState({ gender });
  }

  changeName = (name) => {
    if (name && name.length >= 255) {
      this.setState({ errorName: 'Họ và tên quá 255 kí tự' });
      return window.noti.error('Họ và tên quá 255 kí tự');
    }
    else {
      this.setState({ name, errorName: '' });
    }
  }

  onBlurName = e => {
    const { name } = this.state;
    if (!name || name.trim().length === 0) {
      this.setState({ errorName: 'Trường này không được để trống' });
    }
  }

  changeSchool = (name) => {
    if (name && name.length > 255) {
      window.noti.error('Tên trường quá 255 kí tự');
    } else {
      this.setState({ school: name || '' });
    }
  }

  changeBirthday = (birthday) => {
    this.setState({ birthday });
  }

  changePhone = (phone) => {
    if (phone && phone.length > 10) {
      this.setState({ errorPhone: 'Số điện thoại tối đa 10 kí tự'})
    } else {
      this.setState({ phone, errorPhone: '' });
    }
  }

  onBlurPhone = () => {
    const { phone } = this.state;
    if (!phone) return;
    if (!regex.phone.test(phone)) {
      this.setState({ errorPhone: errorText.phone });
    }
  }

  submit = e => {
    const { name, email, phone, gender, birthday, school, errorName, errorPhone } = this.state;
    this.props.callApiUser('LeftProfile');
    if (errorName || errorPhone) return window.noti.error('Hãy kiểm tra lại thông tin bạn điền');
    this.props.updateUserInfo(name, phone, birthday, gender, school);
    // this.props.updateUserInfo(name, phone, '2020-09ab', gender, school);
  }

  render() {
    const genders = ['nam', 'nữ', 'khác'];
    const { name, email, phone, gender, birthday, school, errorName, errorPhone } = this.state;
    const { user, changeScreen } = this.props;
    return (
      <div className="profile-left d-flex flex-column">
        <div className="profile-row">
          <div className="key">Họ và tên</div>
          <div className="value">
            <input
              type="text" value={name || ''}
              className={errorName ? 'error' : ''}
              placeholder="Nhập họ và tên"
              title={errorName}
              onBlur={e => this.onBlurName(e)}
              onChange={(e) => this.changeName(e.target.value)}
            />
          </div>
        </div>
        <div className="profile-row">
          <div className="key">Email</div>
          <div className="value">
            <span>{hideEmail(email)}</span>
            {/* <Link  to='/thong-tin-ca-nhan' onClick={() => changeScreen('index', 'email')}>
              {email ? 'Thay đổi' : 'Thêm mới'}
            </Link> */}
          </div>
        </div>
        <div className="profile-row">
          <div className="key">Số điện thoại</div>
          <div className="value">
            <input
              type="text"
              value={phone || ''}
              title={errorPhone}
              className={errorPhone ? 'error' : ''}
              placeholder="Nhập số điện thoại"
              onChange={(e) => this.changePhone(e.target.value)}
              onBlur={e => this.onBlurPhone(e)}
              />
            {/*<span>{hidePhone(phone)}</span>
            <Link
              exact to='/thong-tin-ca-nhan'
              onClick={() => changeScreen('index', 'phone')}
              title={user && !user.email ? 'Hãy thêm email trước khi thêm số điện thoại' : ''}
            >
              {phone ? 'Thay đổi' : 'Thêm mới'}</Link> */}
          </div>
        </div>
        <div className="profile-row">
          <div className="key">Trường học</div>
          <div className="value">
            <input
              type="text"
              value={school || ''}
              placeholder="Nhập tên trường học"
              onChange={(e) => this.changeSchool(e.target.value)} />
          </div>
        </div>
        <div className="profile-row">
          <div className="key">Giới tính</div>
          <div className="value">
            {genders.map(item => (
              <div className="choice">
                <input type="radio" name="gender" checked={gender && gender.toLowerCase() === item} onClick={() => this.changeGender(item)} />
                <span style={{ textTransform: 'capitalize' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-row">
          <div className="key">Ngày sinh</div>
          <div className="value">
            <DatePicker
              selected={birthday}
              onChange={(e) => this.changeBirthday(e)}
              dateFormat="dd/MM/yyyy"
              // dateFormat="yyyy-MM-dd"
              placeholder="Nhập họ và tên"
            // locale="vi"
            />
          </div>
        </div>
        <div className="profile-row">
          <div className="key" />
          <div className="value">
            <button className='btn btn-info mr-2' onClick={e => this.submit()}>
              Lưu
            </button>
            <button className="btn btn-outline-info" onClick={e => this.resetState('cancel')} >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  const { auth } = state;
  return {
    user: auth.user,
    callUser: auth.callUser,
  };

};

export default withRouter(connect(
  mapStateToProps,
  {
    updateUserInfo,
    callApiUser,
  },
)(LeftProfile));
