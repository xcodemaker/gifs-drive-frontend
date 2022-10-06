/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import useAuth from 'hooks/useAuth';
import { useCallback, useState, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import { gifUpload, getGifFileList, gifUpdate } from 'store/slices/gif';
import TagIcon from 'ui-component/TagIcon';

const baseURL = process.env.REACT_APP_API_URL;

// ==============================|| SAMPLE PAGE ||============================== //

const HomePage = ({ gifs }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const dispatch = useDispatch();
    const { user } = useAuth();
    const progress = useRef([]);
    const [tagValue, setTagValue] = useState('');
    const [open, setOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState({
        fileKey: '',
        fileName: '',
        id: '',
        publicUrl: '',
        tags: [],
        url: '',
        userId: ''
    });

    const handleClickOpen = (data) => {
        setSelectedFile(data);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedFile({
            fileKey: '',
            fileName: '',
            id: '',
            publicUrl: '',
            tags: [],
            url: '',
            userId: ''
        });
        setOpen(false);
    };

    useEffect(() => {
        dispatch(getGifFileList(user.id));
        // dispatch(downloadFile());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDrag = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    const handleDragIn = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        // eslint-disable-next-line no-plusplus
        dragCounter.current++;
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);
    const handleDragOut = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        // eslint-disable-next-line no-plusplus
        dragCounter.current--;
        if (dragCounter.current > 0) return;
        setIsDragging(false);
    }, []);

    useEffect(() => {
        window.addEventListener('dragenter', handleDragIn);
        window.addEventListener('dragleave', handleDragOut);
        return function cleanUp() {
            window.removeEventListener('dragenter', handleDragIn);
            window.removeEventListener('dragleave', handleDragOut);
            window.removeEventListener('dragover', handleDrag);
        };
    });

    const [files, setFiles] = useState([]);

    const handleDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            if (file.type === 'image/gif') {
                setFiles([...files, file]);
                setIsDragging(false);
                const formData = new FormData();
                formData.append('gif', file);
                formData.append('id', user.id);
                dispatch(
                    gifUpload(formData, (event) => {
                        const progressIndex = progress.current.findIndex((item) => item.fileName === file.name);
                        if (progressIndex > -1) {
                            progress.current[progressIndex] = {
                                progress: Math.round((100 * event.loaded) / event.total),
                                fileName: file.name
                            };
                        } else {
                            progress.current = [
                                ...progress.current,
                                {
                                    progress: Math.round((100 * event.loaded) / event.total),
                                    fileName: file.name
                                }
                            ];
                        }
                        if (Math.round((100 * event.loaded) / event.total) === 100) {
                            setTimeout(() => dispatch(getGifFileList(user.id)), 2000);
                        }
                    })
                );
            }
        });
    };

    const handleUpdateGif = (gifValues) => {
        handleClose();
        dispatch(
            gifUpdate({
                id: gifValues.id,
                fileName: gifValues.fileName,
                tags: gifValues.tags
            })
        ).then(() => {
            setTimeout(() => dispatch(getGifFileList(user.id)), 2000);
        });
    };

    return (
        <div>
            {isDragging && (
                <div className="flex justify-center dropzone-overlay">
                    <Dropzone onDrop={handleDrop} accept="image/gif" minSize={1024} maxSize={3072000}>
                        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
                            // eslint-disable-next-line no-nested-ternary
                            const additionalClass = isDragAccept ? 'accept' : isDragReject ? 'reject' : '';

                            return (
                                <div
                                    {...getRootProps({
                                        className: `dropzone ${additionalClass}`
                                    })}
                                >
                                    <input {...getInputProps()} />
                                    <span>{isDragActive ? '📂' : '📁'}</span>
                                    <p>Drag and drop GIFs here</p>
                                </div>
                            );
                        }}
                    </Dropzone>
                </div>
            )}
            <div className="container my-6 mx-auto">
                <input
                    placeholder="Search your GIFs by name or tags..."
                    className="py-4 px-4 w-full drop-shadow-sm rounded-md outline-blue-100"
                />
            </div>

            <div className="container my-8 mx-auto flex justify-center">
                <div className="w-full xl:w-2/3">
                    <div className="py-4 px-4 my-4 bg-white rounded-md drop-shadow-sm flex flex-wrap items-center gap-4">
                        {gifs.length === 0 && <div>gif list is empty</div>}
                        {gifs.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col items-center gap-1"
                                onClick={() => {
                                    handleClickOpen(item);
                                }}
                            >
                                <div
                                    className="w-40 h-40 border border-slate-100 rounded-md flex items-center justify-center relative"
                                    data-modal="gif-modal"
                                >
                                    {item && item.tags && (
                                        <div className="absolute top-1 left-1 right-1 flex flex-wrap text-xs">
                                            {item.tags.map((tag) => (
                                                <div className="bg-gray-600 text-white py-1 px-2 rounded-md m-1 drop-shadow-sm">{tag}</div>
                                            ))}
                                        </div>
                                    )}
                                    <img className="w-full h-auto" src={`${baseURL}${item.url}`} alt="gif" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{item.fileName}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-gray-700/40 flex items-center justify-center modal-wrapper"
                        id="gif-modal"
                    >
                        <div className="w-1/2 h-1/2 bg-white rounded-md drop-shadow-md p-4 flex flex-col">
                            <div className="flex-1 self-stretch">
                                <div>
                                    <label htmlFor="gif-name-input" className="font-bold block w-full">
                                        Name
                                    </label>
                                    <input
                                        className="border px-2 py-1 mt-1 rounded-md text-gray-900 w-full outline-1 outline-blue-100"
                                        id="gif-name-input"
                                        type="text"
                                        value={selectedFile.fileName}
                                        onChange={(event) => {
                                            setSelectedFile({ ...selectedFile, fileName: event.target.value });
                                        }}
                                    />
                                </div>

                                {selectedFile && (
                                    <div className="my-4">
                                        <label htmlFor="gif-add-tag" className="font-bold block w-full">
                                            Tags
                                        </label>
                                        <div className="my-2 flex flex-wrap">
                                            {selectedFile.tags.map((tag) => (
                                                <span className="px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease mr-1">
                                                    {tag}
                                                    <button
                                                        className="bg-transparent hover focus:outline-none"
                                                        onClick={() => {
                                                            const index = selectedFile.tags.findIndex((tagTemp) => tagTemp === tag);
                                                            const tmp = selectedFile.tags;
                                                            if (index > -1) {
                                                                tmp.splice(index, 1);
                                                            }
                                                            setSelectedFile({ ...selectedFile, tags: tmp });
                                                        }}
                                                    >
                                                        <TagIcon />
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                id="gif-add-tag"
                                                className="ml-2 outline-0"
                                                placeholder="Add a new tag..."
                                                value={tagValue}
                                                onChange={(event) => {
                                                    setTagValue(event.target.value);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.keyCode === 13 && event.target.value) {
                                                        const tmp = [...selectedFile.tags, event.target.value];
                                                        setSelectedFile({ ...selectedFile, tags: tmp });
                                                        setTagValue('');
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="gif-sharing-url" className="font-bold block w-full">
                                    Public URL
                                </label>
                                <input
                                    id="gif-sharing-url"
                                    type="text"
                                    disabled
                                    className="mb-4 mt-1 w-full p-2 text-gray-400 text-sm font-semibold rounded-md bg-gray-100"
                                    value={`${baseURL}${selectedFile.publicUrl}`}
                                />
                            </div>

                            <div className="text-right">
                                <button
                                    className="py-1 px-8 bg-slate-800 text-white rounded-md text-lg cursor-pointer font-semibold"
                                    onClick={() => {
                                        handleUpdateGif(selectedFile);
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className="py-1 px-8 bg-gray-400 text-white rounded-md text-lg cursor-pointer font-semibold"
                                    data-close-modal
                                    onClick={() => {
                                        handleClose();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        gifs: state.file.gifList
    };
}

HomePage.propTypes = {
    gifs: PropTypes.array
};

export default connect(mapStateToProps)(HomePage);
