import CustomerSelector from '@/components/customer-selector';
import PaymentStatusSelector from '@/components/payment-status-selector';
import ProductSelector from '@/components/product-selector';
import TransactionPageHeader from '@/components/transaction-page-header';
import { TransactionSummary } from '@/components/transaction-summary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@/types/page-props';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
    {
        title: 'Transaksi Baru',
        href: '/transactions/create',
    },
];

interface Customer {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

interface PaymentMethod {
    id: string;
    name: string;
}

interface TransactionStatus {
    id: string;
    name: string;
}

interface TransactionItem {
    product_id: string;
    product_name?: string;
    quantity: number;
    unit_price: number;
    applied_tax_percentage: number;
    subtotal: number;
    tax_amount: number;
}

interface CreatePageProps extends PageProps {
    customers: Customer[];
    products: Product[];
    paymentMethods: PaymentMethod[];
    transactionStatuses: TransactionStatus[];
}
type TransactionItemInput = Pick<TransactionItem, 'product_id' | 'quantity' | 'unit_price' | 'applied_tax_percentage'>;

export default function Create({ customers, products, paymentMethods, transactionStatuses }: CreatePageProps) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        payment_method_id: '',
        transaction_status_id: '',
        items: [] as TransactionItemInput[],
        notes: '',
    });

    const [selectedProducts, setSelectedProducts] = useState<TransactionItem[]>([]);
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const hasErrors = Object.keys(errors).length > 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setData('customer_id', customer.id);
        setIsCustomerDropdownOpen(false);
        setSearchCustomer('');
    };

    const handleResetCustomer = () => {
        setSelectedCustomer(null);
        setData('customer_id', '');
        setSearchCustomer('');
        setIsCustomerDropdownOpen(false);
    };

    const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (selectedCustomer) {
            return;
        }

        setSearchCustomer(value);
        setIsCustomerDropdownOpen(true);
    };

    const handleCustomerInputFocus = () => {
        if (!selectedCustomer) {
            setIsCustomerDropdownOpen(true);
        }
    };

    const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchProduct(value);
        setIsProductDropdownOpen(true);
    };

    const handleProductInputFocus = () => {
        setIsProductDropdownOpen(true);
    };

    const addProduct = (product: Product) => {
        const newItem: TransactionItem = {
            product_id: product.id,
            product_name: product.name,
            quantity: 1,
            unit_price: product.price,
            applied_tax_percentage: 11,
            subtotal: product.price,
            tax_amount: product.price * 0.11,
        };

        const updatedItems = [...selectedProducts, newItem];
        setSelectedProducts(updatedItems);

        setData(
            'items',
            updatedItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                applied_tax_percentage: item.applied_tax_percentage,
            })),
        );

        setSearchProduct('');
        setIsProductDropdownOpen(false);
    };

    const updateItemQuantity = (index: number, quantity: number) => {
        if (quantity < 1) return;

        const updatedItems = [...selectedProducts];
        const item = updatedItems[index];

        item.quantity = quantity;
        item.subtotal = item.unit_price * quantity;
        item.tax_amount = item.subtotal * (item.applied_tax_percentage / 100);

        setSelectedProducts(updatedItems);

        setData(
            'items',
            updatedItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                applied_tax_percentage: item.applied_tax_percentage,
            })),
        );
    };

    const updateItemTaxPercentage = (index: number, taxPercentage: number) => {
        const updatedItems = [...selectedProducts];
        const item = updatedItems[index];
        const tax_amount = item.subtotal * (taxPercentage / 100);

        updatedItems[index] = {
            ...item,
            applied_tax_percentage: taxPercentage,
            tax_amount,
        };

        setSelectedProducts(updatedItems);
        setData(
            'items',
            updatedItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                applied_tax_percentage: item.applied_tax_percentage,
            })),
        );
    };

    const removeItem = (index: number) => {
        const updatedItems = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedItems);
        setData(
            'items',
            updatedItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                applied_tax_percentage: item.applied_tax_percentage,
            })),
        );
    };

    const calculateTotals = () => {
        const subtotal = selectedProducts.reduce((sum, item) => sum + item.subtotal, 0);
        const totalTax = selectedProducts.reduce((sum, item) => sum + item.tax_amount, 0);
        const total = subtotal + totalTax;

        return { subtotal, totalTax, total };
    };

    const handleSubmit = () => {
        if (selectedProducts.length === 0) {
            return;
        }
        post('/transaction');
    };

    const { subtotal, totalTax, total } = calculateTotals();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.customer-dropdown-container')) {
                setIsCustomerDropdownOpen(false);
            }
            if (!target.closest('.product-dropdown-container')) {
                setIsProductDropdownOpen(false);
            }
        };

        if (isCustomerDropdownOpen || isProductDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCustomerDropdownOpen, isProductDropdownOpen]);
    const handlePaymentMethodChange = (value: string) => {
        setData('payment_method_id', value);
    };

    const handleTransactionStatusChange = (value: string) => {
        setData('transaction_status_id', value);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Baru" />

            <div className="container mx-auto max-w-6xl p-6">
                <TransactionPageHeader />

                <Separator className="mb-6" />

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Terdapat kesalahan pada form. Silakan periksa kembali data yang dimasukkan.</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <CustomerSelector
                                customers={customers}
                                selectedCustomer={selectedCustomer}
                                searchCustomer={searchCustomer}
                                isCustomerDropdownOpen={isCustomerDropdownOpen}
                                errors={errors}
                                onSelectCustomer={handleSelectCustomer}
                                onResetCustomer={handleResetCustomer}
                                onInputChange={handleCustomerInputChange}
                                onInputFocus={handleCustomerInputFocus}
                            />
                            <ProductSelector
                                products={products}
                                selectedProducts={selectedProducts}
                                searchProduct={searchProduct}
                                isProductDropdownOpen={isProductDropdownOpen}
                                // errors={errors}
                                errors={{ items: errors.items ?? '' }}
                                onProductInputChange={handleProductInputChange}
                                onProductInputFocus={handleProductInputFocus}
                                onAddProduct={addProduct}
                                onUpdateItemQuantity={updateItemQuantity}
                                onUpdateItemTaxPercentage={updateItemTaxPercentage}
                                onRemoveItem={removeItem}
                                formatCurrency={formatCurrency}
                            />

                            <PaymentStatusSelector
                                paymentMethods={paymentMethods}
                                transactionStatuses={transactionStatuses}
                                selectedPaymentMethodId={data.payment_method_id}
                                selectedTransactionStatusId={data.transaction_status_id}
                                errors={errors}
                                onPaymentMethodChange={handlePaymentMethodChange}
                                onTransactionStatusChange={handleTransactionStatusChange}
                            />
                        </div>

                        <TransactionSummary
                            selectedCustomer={selectedCustomer}
                            selectedProducts={selectedProducts}
                            subtotal={subtotal}
                            totalTax={totalTax}
                            total={total}
                            formatCurrency={formatCurrency}
                            processing={processing}
                            paymentMethodId={data.payment_method_id}
                            transactionStatusId={data.transaction_status_id}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
