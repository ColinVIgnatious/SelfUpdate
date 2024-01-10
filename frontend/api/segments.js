import axios from 'axios'

export function createSegment({ title, description, uploadId, chapterId }) {
	return axios
		.post(`/api/create-segment/${chapterId}`, { title, description, uploadId })
		.then((res) => res.data.segment)
}

export function deleteSegment({ segmentId }) {
    return axios.delete(`/api/delete-segment/${segmentId}`).then((res) => res.data.segment)
}
