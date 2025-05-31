import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function TransactionGuidelines() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Panduan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-600">
                <p>• Pilih customer dengan mengetik nama di kolom pencarian</p>
                <p>• Tambahkan produk dengan mencari dan mengklik produk yang diinginkan</p>
                <p>• Atur jumlah dan persentase pajak untuk setiap produk</p>
                <p>• Pilih metode pembayaran dan status transaksi</p>
                <p>• Semua field wajib diisi sebelum menyimpan</p>
            </CardContent>
        </Card>
    );
}

export default TransactionGuidelines;
