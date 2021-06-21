import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Space, message } from 'antd';
import {post} from "../../utils/requestUtil";
import ipPort from '../../common/ipPort'

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  required,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]"

const deepClone = (source) => {
  let target = Array.isArray(source) ? [] : {}
  if (isObject(source)) {
      for(let key of source) {
        if (source.hasOwnProperty(key)) {
          if (isObject(source) || Array.isArray(source[key])) target[key] = deepClone(source[key]);
          else target[key] = source[key];
        }
      }
  }
  else if (Array.isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      if (isObject(source) || Array.isArray(source[i])) target[i] = deepClone(source[i]);
      else target[i] = source[i];
    }
  }
  return target
}

const EdiTable = (props) => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [editingKey, setEditingKey] = useState('')

  useEffect(() => {
    setEditingKey(props.editingKey)
  }, [props.editingKey])

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  //表格列配置
  const columns = [
    {
            title: '类别编码',
            dataIndex: 'code',
            editable: true,
            required: true,
            key: 'code',
            width: '20%'
        },
        {
            title: '类别名称',
            editable: true,
            required: true,
            dataIndex: 'name',
            key: 'name',
            width: '20%'
        },
        {
            title: '备注',
            editable: true,
            required: false,
            dataIndex: 'remark',
            key: 'remark',
            width: '20%'
        },
        {
            title: '发布日期',
            dataIndex: 'create_date',
            key: 'create_date',
            width: '17%'
        },
        {
            title: '更新日期',
            dataIndex: 'update_date',
            key: 'update_date',
            width: '17%'
        },
        {
          title: '操作',
          key: 'operation',
          dataIndex: 'operation',
          //width: '10%',
          render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
            <Space>
              { props.isSave && <Button type={'primary'}
                href="javascript:;"
                onClick={ () => handleSave(record) }
                style={{
                    marginRight: 8,
                }}
                >
                保存
                </Button>}
                <Popconfirm title="确定取消?" onConfirm={cancel}>
                    <Button type={'primary'}>取消</Button>
                </Popconfirm>
            </Space>
            ) : (
                <Space>
                    <Button type={'primary'} disabled={editingKey !== ''} onClick={ () => {
                        edit(record);
                    }}>
                        编辑
                    </Button>
                    { props.isDelete &&
                    <Popconfirm title={'确定删除该类型吗？'} cancelText={'取消'} okText={'确定'}
                        onConfirm={ typeof props.delete && props.delete.bind(EdiTable, record) }>
                        <Button>删除</Button>
                    </Popconfirm>}
                </Space>
            );
          }
      }
  ];
  
  const isEditing = (record) => record.id.toString() === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: '',
      code: '',
      name: '',
      remark: '',
      ...record,
    })
    setEditingKey(record.id.toString())
  }

  const cancel = () => {
    setEditingKey('');
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  async function handleSave(table) {
        let row = await form.validateFields();
        row = Object.assign(table, row)
        console.log(row)
        let suffixUrl = '/default/updateArticleType'
        if (row.operation === 'add') suffixUrl = '/default/addArticleType'
        try {
            let res = await post(ipPort + suffixUrl, { ...row })
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success) {
                message.success(`保存成功`)
                setEditingKey('')
            } else {
                message.error(`保存失败,异常信息：${res.code}`)
            }
        } catch (error) {
            message.error(`保存失败,异常信息：${error}`) 
        }
  };

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EdiTable